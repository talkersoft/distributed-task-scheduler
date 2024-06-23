import { AppDataSource, Task, TaskSchedule, ExecutionStatus } from 'task-entities';
import { parseExpression } from 'cron-parser';

interface SchedulerConfig {
    scheduleInterval: number;
}

const defaultConfig: SchedulerConfig = {
    scheduleInterval: 60000,
};

async function scheduleTasks(config: SchedulerConfig = defaultConfig) {
    const queryRunner = AppDataSource.createQueryRunner();

    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const now = new Date();
        const todayStartUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const todayEndUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

        const recurringTasks: Task[] = await queryRunner.query(`
            SELECT t.*
            FROM tasks t
            WHERE t.is_recurring = true
        `);

        for (const task of recurringTasks) {
            if (!task.cron_expression) {
                console.error(`Task with ID ${task.id} is recurring but has no cron expression.`);
                continue;
            }

            const taskCreatedUTC = new Date(task.task_created);
            if (taskCreatedUTC > now) {
                continue;
            }

            const existingSchedule = await queryRunner.query(`
                SELECT 1
                FROM task_schedule ts
                WHERE ts.task_id = $1
                AND ts.scheduled_time BETWEEN $2 AND $3
            `, [task.id, todayStartUTC, todayEndUTC]);

            if (existingSchedule.length === 0) {
                const interval = parseExpression(task.cron_expression, { currentDate: todayStartUTC });
                let nextRunTime = interval.next().toDate();

                while (nextRunTime < todayEndUTC) {
                    if (nextRunTime < taskCreatedUTC) {
                        nextRunTime = interval.next().toDate();
                        continue;
                    }

                    console.log(`Scheduling recurring task: ${task.id} at ${nextRunTime.toISOString()}`);
                    await queryRunner.query(
                        'INSERT INTO task_schedule (task_id, scheduled_time, status) VALUES ($1, $2, $3)',
                        [task.id, nextRunTime.toISOString(), ExecutionStatus.Scheduled]
                    );

                    nextRunTime = interval.next().toDate();
                }
            }
        }

        await queryRunner.commitTransaction();
        console.log('Transaction committed.');
    } catch (err) {
        console.error('Error during transaction, rolling back...', err);
        await queryRunner.rollbackTransaction();
        console.log('Transaction rolled back.');
    } finally {
        await queryRunner.release();
    }
}

export { scheduleTasks, SchedulerConfig, defaultConfig };
