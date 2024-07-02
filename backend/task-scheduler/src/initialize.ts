// Copyright Talkersoft LLC
// /backend/task-scheduler/src/initialize.ts
import { AppDataSource } from 'task-entities';
import { scheduleTasks } from './scheduler';

const RETRY_INTERVAL = 5000;
const MAX_RETRIES = 10;

interface SchedulerConfig {
    scheduleInterval: number;
}

const defaultConfig: SchedulerConfig = {
    scheduleInterval: parseInt(process.env.SCHEDULE_INTERVAL || '60000', 10),
};

function getTimeUntilMidnight() {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setDate(now.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);
    return nextMidnight.getTime() - now.getTime();
}

async function initializeScheduler(config: SchedulerConfig = defaultConfig, retries = 0) {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');
        console.log(`Scheduling tasks to run every ${config.scheduleInterval / 1000} seconds.`);

        setInterval(() => scheduleTasks(config), config.scheduleInterval);

        const timeUntilMidnight = getTimeUntilMidnight();
        setTimeout(function scheduleMidnight() {
            scheduleTasks(config);
            setTimeout(scheduleMidnight, 24 * 60 * 60 * 1000);
        }, timeUntilMidnight);

    } catch (err) {
        if (retries < MAX_RETRIES) {
            console.log(`Retrying database connection in ${RETRY_INTERVAL / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => initializeScheduler(config, retries + 1), RETRY_INTERVAL);
        } else {
            console.error('Error during Data Source initialization after maximum retries:', err);
        }
    }
}

export { initializeScheduler, defaultConfig, SchedulerConfig };
