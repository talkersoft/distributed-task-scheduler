import amqp from 'amqplib/callback_api';

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'guest';

async function publishToRabbitMQ(message: string) {
  return new Promise((resolve, reject) => {
    amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`, (err, connection) => {
      if (err) {
        console.error('Error connecting to RabbitMQ', err);
        return reject(err);
      }
      connection.createChannel((err, channel) => {
        if (err) {
          console.error('Error creating RabbitMQ channel', err);
          connection.close(); // Close the connection before rejecting
          return reject(err);
        }
        const exchange = 'task_exchange';
        const routingKey = 'task.message';

        channel.assertExchange(exchange, 'topic', { durable: true });
        
        const wasPublished = channel.publish(exchange, routingKey, Buffer.from(message));
        
        if (!wasPublished) {
          console.error('Error publishing message to RabbitMQ');
          connection.close(); // Close the connection before rejecting
          return reject(new Error('Message was not published'));
        }

        setTimeout(() => {
          connection.close();
          resolve(true);
        }, 500);
      });
    });
  });
}

export { publishToRabbitMQ };
