import amqp from 'amqplib/callback_api';
import { Client } from 'pg';
import { Channel, Connection } from 'amqplib/callback_api';

const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
const RABBITMQ_USER = process.env.RABBITMQ_USER;
const RABBITMQ_PASS = process.env.RABBITMQ_PASS;
const RABBITMQ_QUEUE = 'task_queue';

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});

client.connect()
  .then(() => {
    console.log('Connected to the database');
    
    amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`, (error0: any, connection: Connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1: any, channel: Channel) => {
        if (error1) {
          throw error1;
        }
        channel.assertQueue(RABBITMQ_QUEUE, {
          durable: true
        });
        channel.prefetch(1);
        console.log('Waiting for messages in %s', RABBITMQ_QUEUE);

        channel.consume(RABBITMQ_QUEUE, (msg) => {
          if (msg !== null) {
            const task = JSON.parse(msg.content.toString());
            console.log('Processing task:', task);
            





            // UPDATE TASK STATUS
            // Started
            // Completed
            // Failed


            // Start processing task
            const startTime = new Date();

            // Simulate task processing with a timeout
            setTimeout(() => {
              const endTime = new Date();
              const elapsedTime = endTime.getTime() - startTime.getTime();

              console.log('Task completed:', task.id);

              // Log task execution to the database
              client.query(`
                INSERT INTO task_executions (task_id, start_time, end_time, status, elapsed_time)
                VALUES ($1, $2, $3, $4, $5)
              `, [task.id, startTime, endTime, 'Completed', elapsedTime])
                .then(() => {
                  console.log('Task execution logged:', task.id);
                  channel.ack(msg);
                })
                .catch(err => {
                  console.error('Error logging task execution', err.stack);
                  channel.nack(msg, false, false); // Reject the message without requeuing
                });
            }, 1000); // Simulate task processing time
          }
        }, {
          noAck: false
        });
      });
    });
  })
  .catch((err) => console.error('Connection error', err.stack));
