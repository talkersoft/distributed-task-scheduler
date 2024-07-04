// Copyright Talkersoft LLC
// /backend/task-scheduler/src/initialize.ts
import { AppDataSource } from 'task-entities';
import { scheduleTasks } from './scheduler';

const RETRY_INTERVAL = 5000;
const MAX_RETRIES = 10;

const SCHEDULE_INTERVAL = parseInt(process.env.SCHEDULE_INTERVAL || '60000', 10);
if (isNaN(SCHEDULE_INTERVAL) || SCHEDULE_INTERVAL > 60000) {
    console.error('60000 milliseconds (1 minute) or less.');
    process.exit(1);
}

async function initializeScheduler(retries = 0) {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');
        console.log(`Scheduling tasks to run every ${SCHEDULE_INTERVAL / 1000} seconds.`);

        setInterval(() => {
            scheduleTasks();
        }, SCHEDULE_INTERVAL); // Use validated schedule interval
    } catch (err) {
        if (retries < MAX_RETRIES) {
            console.log(`Retrying database connection in ${RETRY_INTERVAL / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => initializeScheduler(retries + 1), RETRY_INTERVAL);
        } else {
            console.error('Error during Data Source initialization after maximum retries:', err);
        }
    }
}

export { initializeScheduler };
