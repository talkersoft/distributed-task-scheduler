import { AppDataSource, Task, TaskSchedule, ExecutionStatus } from 'task-scheduler-entities';
import { parseExpression } from 'cron-parser'; // Import cron-parser to handle cron expressions

const RETRY_INTERVAL = 2000;
const MAX_RETRIES = 10;

interface SchedulerConfig {
    scheduleInterval: number;
    endTimeOffset: number;
}

const defaultConfig: SchedulerConfig = {
    scheduleInterval: 60000,
    endTimeOffset: 15 * 60 * 1000, // Updated to 15 minutes
};

async function scheduleTasks(config: SchedulerConfig) {
    const queryRunner = AppDataSource.createQueryRunner();

    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const now = new Date();
        const endTime = new Date(now.getTime() + config.endTimeOffset);

        console.log('Querying one-time tasks...');
        const oneTimeTasks: Task[] = await queryRunner.query(`
            SELECT t.*
            FROM tasks t
            LEFT JOIN task_schedule ts ON t.id = ts.task_id
            WHERE t.scheduled_execution_time BETWEEN '1970-01-01' AND $1
            AND ts.task_id IS NULL
            AND t.is_recurring = false
        `, [endTime]);
        console.log(`Found ${oneTimeTasks.length} one-time tasks to schedule.`);

        const newTaskSchedule: Partial<TaskSchedule>[] = [];

        for (const task of oneTimeTasks) {
            newTaskSchedule.push({
                task: task,
                start_time: task.scheduled_execution_time,
                status: ExecutionStatus.Scheduled,
            });
        }

        console.log('Querying recurring tasks...');
        const recurringTasks: Task[] = await queryRunner.query(`
            SELECT t.*
            FROM tasks t
            WHERE t.is_recurring = true
        `);
        console.log(`Found ${recurringTasks.length} recurring tasks to schedule.`);

        for (const task of recurringTasks) {
            const lastSchedule = await queryRunner.query(`
                SELECT MAX(ts.scheduled_execution_time) as last_schedule
                FROM task_schedule ts
                WHERE ts.task_id = $1
            `, [task.id]);

            let nextRunTime = lastSchedule[0].last_schedule ? new Date(lastSchedule[0].last_schedule) : new Date();
            if (!lastSchedule[0].last_schedule) {
                nextRunTime = new Date();
            }

            const interval = parseExpression(task.cron_expression, { currentDate: nextRunTime });

            while (true) {
                nextRunTime = interval.next().toDate();
                if (nextRunTime > endTime) break;

                newTaskSchedule.push({
                    task: task,
                    start_time: nextRunTime,
                    status: ExecutionStatus.Scheduled,
                });
            }
        }

        for (const execution of newTaskSchedule) {
            if (execution.task) {
                await queryRunner.query(
                    'INSERT INTO task_schedule (task_id, start_time, status) VALUES ($1, $2, $3)',
                    [execution.task.id, execution.start_time, execution.status]
                );
            } else {
                console.error('Task is undefined for one of the executions.');
            }
        }
        console.log('Task schedules inserted.');

        await queryRunner.commitTransaction();
        console.log('Transaction committed.');
    } catch (err) {
        console.error('Error during transaction, rolling back...', err);
        await queryRunner.rollbackTransaction();
        console.log('Transaction rolled back.');
        throw err;
    } finally {
        await queryRunner.release();
        console.log('QueryRunner released.');
    }
}

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

initializeScheduler(defaultConfig);
