import { AppDataSource, Task, TaskSchedule, ExecutionStatus } from 'task-scheduler-entities';
// import { checkScalingNeeded } from './utils/scalingCheck';

const RETRY_INTERVAL = 2000;
const MAX_RETRIES = 10;

async function scheduleTasks() {
    const queryRunner = AppDataSource.createQueryRunner();

    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        console.log('Querying tasks...');
        const tasks: Task[] = await queryRunner.query(`
            SELECT t.*
            FROM tasks t
            LEFT JOIN task_schedule ts ON t.id = ts.task_id
            WHERE t.scheduled_execution_time BETWEEN $1 AND $2
            AND ts.task_id IS NULL
        `, [now, oneHourLater]);
        console.log(`Found ${tasks.length} tasks to schedule.`);

        const newTaskSchedule: Partial<TaskSchedule>[] = [];

        for (const task of tasks) {
            newTaskSchedule.push({
                task: task,
                start_time: task.scheduled_execution_time,
                status: ExecutionStatus.Scheduled,
            });
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

async function initializeScheduler(retries = 0) {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        setInterval(scheduleTasks, 60000);
    } catch (err) {
        if (retries < MAX_RETRIES) {
            console.log(`Retrying Data Source initialization in ${RETRY_INTERVAL / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => initializeScheduler(retries + 1), RETRY_INTERVAL);
        } else {
            console.error('Error during Data Source initialization after maximum retries:', err);
        }
    }
}

initializeScheduler();
