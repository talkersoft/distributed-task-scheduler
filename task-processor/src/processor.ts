import { Message } from 'amqplib/callback_api';
import { connectToRabbitMQ, createChannelWithRetry, setupQueueWithRetry } from './rabbitmq';
import { makeApiRequest, ApiResponse } from './apiRequest';
import { initializeDatabaseConnection, updateTaskStartTimeAndStatus, updateTaskEndTimeAndStatus } from './database';

const API_URL = process.env.API_URL || 'https://api.namefake.com/english-united-states';
const MAX_PROCESS_RETRIES = 3;

async function processMessages() {
  await initializeDatabaseConnection();
  try {
    const connection = await connectToRabbitMQ();
    const channel = await createChannelWithRetry(connection);

    const queue = 'task_queue';
    const deadLetterQueue = 'task_deadletter_queue';

    await setupQueueWithRetry(channel, queue, deadLetterQueue);

    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, async (msg: Message | null) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        const { taskScheduleId, name, metadata } = content;

        console.log(`Received message: task id: ${taskScheduleId}, name: ${name}, metadata: ${JSON.stringify(metadata)}`);

        let retryCount = 0;
        if (msg.properties.headers && typeof msg.properties.headers['x-retries'] === 'number') {
          retryCount = msg.properties.headers['x-retries'] as number;
        }

        try {
          await updateTaskStartTimeAndStatus(taskScheduleId);

          const data: ApiResponse = await makeApiRequest(API_URL);

          // Update end_time and status to Completed
          await updateTaskEndTimeAndStatus(taskScheduleId);

          // Diagnostic logging
          console.log(`Task ${taskScheduleId} processed successfully, marked as Completed`);

          channel.ack(msg);
        } catch (error) {
          console.error(`Failed to process task ${taskScheduleId}`, error);

          if (retryCount < MAX_PROCESS_RETRIES) {
            retryCount++;
            console.log(`Retrying task ${taskScheduleId} (${retryCount}/${MAX_PROCESS_RETRIES})`);
            channel.nack(msg, false, false);
            channel.publish('task_exchange', 'task.message', msg.content, {
              headers: { 'x-retries': retryCount }
            });
          } else {
            console.error(`Moving task ${taskScheduleId} to dead-letter queue after ${MAX_PROCESS_RETRIES} attempts`);
            channel.nack(msg, false, false);
            channel.sendToQueue(deadLetterQueue, msg.content);
          }
        }
      }
    });
  } catch (err) {
    console.error('Error processing messages', err);
  }
}

export { processMessages };
