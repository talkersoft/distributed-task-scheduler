// Copyright Talkersoft LLC
// /backend/task-processor/src/processor.ts
import { Message } from 'amqplib/callback_api';
import { connectToRabbitMQ, createChannelWithRetry, setupQueueWithRetry } from './rabbitmq';
import { makeReminderApiRequest, makeNotificationApiRequest, ApiResponse } from './apiRequest';
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
        const { taskScheduleId, name, message, taskType} = content;
        
        let retryCount = 0;
        if (msg.properties.headers && typeof msg.properties.headers['x-retries'] === 'number') {
          retryCount = msg.properties.headers['x-retries'] as number;
        }

        try {
          await updateTaskStartTimeAndStatus(taskScheduleId);

          let data: ApiResponse;
          if (taskType === 'reminder') {
            data = await makeReminderApiRequest(API_URL);
            console.log(`Received ${taskType} - Task Name: ${name}, ${data.name}, don't forget to ${message} before you play ${data.sport}`);
          } else if (taskType === 'notification') {
            data = await makeNotificationApiRequest(API_URL);
            const maskedCard = data.plasticcard.slice(0, -4).replace(/\d/g, '*') + data.plasticcard.slice(-4);
            console.log(`Received ${taskType} - Task Name: ${name}, ${data.name}, your credit card# ${maskedCard} has been declined, please update payment method.`);
          } else {
            throw new Error(`Unknown task type: ${taskType}`);
          }
                    
          await updateTaskEndTimeAndStatus(taskScheduleId);
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
