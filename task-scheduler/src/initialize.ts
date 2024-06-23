import { AppDataSource } from 'task-entities';
import { scheduleTasks, SchedulerConfig, defaultConfig } from './scheduler';

const RETRY_INTERVAL = 2000;
const MAX_RETRIES = 10;

async function initializeScheduler(config: SchedulerConfig, retries = 0) {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        console.log(`Scheduling tasks to run every ${config.scheduleInterval / 1000} seconds.`);
        setInterval(() => scheduleTasks(config), config.scheduleInterval);
    } catch (err) {
        if (retries < MAX_RETRIES) {
            console.log(`Retrying Data Source initialization in ${RETRY_INTERVAL / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => initializeScheduler(config, retries + 1), RETRY_INTERVAL);
        } else {
            console.error('Error during Data Source initialization after maximum retries:', err);
        }
    }
}

export { initializeScheduler, defaultConfig };
