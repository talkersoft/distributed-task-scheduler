// Copyright Talkersoft LLC
// /backend/task-distributor/src/rabbitmq.ts
import amqp from 'amqplib/callback_api';

const RETRY_INTERVAL = 5000;
const MAX_RETRIES = 10;

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'guest';

function setupRabbitMQ(retries = 0): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`, (err, connection) => {
      if (err) {
        if (retries < MAX_RETRIES) {
          console.log(`Retrying RabbitMQ connection in ${RETRY_INTERVAL / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
          return setTimeout(() => setupRabbitMQ(retries + 1).then(resolve).catch(reject), RETRY_INTERVAL);
        } else {
          console.error('Error connecting to RabbitMQ after maximum retries', err);
          return reject(err);
        }
      }
      connection.createChannel((err, channel) => {
        if (err) {
          console.error('Error creating RabbitMQ channel', err);
          return reject(err);
        }
        const exchange = 'task_exchange';
        const queue = 'task_queue';
        const deadLetterQueue = 'task_deadletter_queue';
        const routingKey = 'task.message';

        channel.assertExchange(exchange, 'topic', { durable: true });
        channel.assertQueue(deadLetterQueue, { durable: true });
        channel.assertQueue(queue, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': '',
            'x-dead-letter-routing-key': deadLetterQueue
          }
        });
        channel.bindQueue(queue, exchange, routingKey);

        console.log(`Exchange ${exchange}, queue ${queue}, and dead-letter queue ${deadLetterQueue} are set up with routing key ${routingKey}`);
        resolve();
      });
    });
  });
}

export { setupRabbitMQ };
