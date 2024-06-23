import amqp from 'amqplib/callback_api';

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'guest';
const CONNECTION_RETRY_INTERVAL = 2000;
const CONNECTION_MAX_RETRIES = 10;
const CHANNEL_RETRY_INTERVAL = 5000;
const QUEUE_SETUP_RETRY_INTERVAL = 5000;
const QUEUE_SETUP_MAX_RETRIES = 10;

async function connectToRabbitMQ(retries = 0): Promise<amqp.Connection> {
  return new Promise((resolve, reject) => {
    amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`, (err, connection) => {
      if (err) {
        if (retries < CONNECTION_MAX_RETRIES) {
          console.error(`Failed to connect to RabbitMQ (attempt ${retries + 1}/${CONNECTION_MAX_RETRIES}), retrying...`, err);
          setTimeout(() => {
            connectToRabbitMQ(retries + 1).then(resolve).catch(reject);
          }, CONNECTION_RETRY_INTERVAL);
        } else {
          console.error('Could not connect to RabbitMQ after several attempts', err);
          reject(err);
        }
      } else {
        console.log('Connected to RabbitMQ');
        resolve(connection);
      }
    });
  });
}

async function createChannelWithRetry(connection: amqp.Connection, retries = 0): Promise<amqp.Channel> {
  return new Promise((resolve, reject) => {
    connection.createChannel((err, channel) => {
      if (err) {
        if (retries < CONNECTION_MAX_RETRIES) {
          console.error(`Failed to create RabbitMQ channel (attempt ${retries + 1}/${CONNECTION_MAX_RETRIES}), retrying...`, err);
          setTimeout(() => {
            createChannelWithRetry(connection, retries + 1).then(resolve).catch(reject);
          }, CHANNEL_RETRY_INTERVAL);
        } else {
          console.error('Could not create RabbitMQ channel after several attempts', err);
          reject(err);
        }
      } else {
        console.log('RabbitMQ channel created');
        resolve(channel);
      }
    });
  });
}

async function setupQueueWithRetry(channel: amqp.Channel, queue: string, deadLetterQueue: string, retries = 0): Promise<void> {
  return new Promise((resolve, reject) => {
    channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': deadLetterQueue
      }
    }, (err, ok) => {
      if (err) {
        if (retries < QUEUE_SETUP_MAX_RETRIES) {
          console.error(`Failed to assert RabbitMQ queue (attempt ${retries + 1}/${QUEUE_SETUP_MAX_RETRIES}), retrying...`, err);
          setTimeout(() => {
            setupQueueWithRetry(channel, queue, deadLetterQueue, retries + 1).then(resolve).catch(reject);
          }, QUEUE_SETUP_RETRY_INTERVAL);
        } else {
          console.error('Could not assert RabbitMQ queue after several attempts', err);
          reject(err);
        }
      } else {
        console.log(`RabbitMQ queue ${queue} asserted`);
        resolve();
      }
    });
  });
}

export { connectToRabbitMQ, createChannelWithRetry, setupQueueWithRetry };
