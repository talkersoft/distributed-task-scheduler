import { AppDataSource, Task, ExecutionStatus } from 'task-entities';
import { parseExpression, ParserOptions } from 'cron-parser';
import moment, { Moment } from 'moment-timezone';

async function scheduleTasks(config: { scheduleInterval: number }) {
    const queryRunner = AppDataSource.createQueryRunner();

    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const now: Moment = moment().utc();
        const todayStartUTC: Moment = now.clone().startOf('day');
        const todayEndUTC: Moment = now.clone().add(1, 'day').startOf('day');

        // Combined query to fetch recurring tasks without existing schedules in the specified date range
        const recurringTasks: Task[] = await queryRunner.query(`
            SELECT t.* 
            FROM tasks t
            LEFT JOIN task_schedule ts ON t.id = ts.task_id 
                AND ts.scheduled_time >= '2024-06-29 00:00:00' 
                AND ts.scheduled_time < '2024-06-30 00:00:00'
            WHERE ts.id IS NULL
                AND t.is_recurring = true
        `);

        for (const task of recurringTasks) {
            if (!task.cron_expression) {
                console.error(`Task with ID ${task.id} is recurring but has no cron expression.`);
                continue;
            }

            const taskCreatedInUTC: Moment = moment.utc(task.task_created);
            const taskTimeZone = task.time_zone;
            const options: ParserOptions = { currentDate: todayStartUTC.toDate(), tz: taskTimeZone };
            const cronInterval = parseExpression(task.cron_expression, options);

            while (true) {
                const nextScheduledRunInTaskTimeZone = moment.tz(cronInterval.next().toDate(), taskTimeZone);
                let nextScheduledRunInUTC = nextScheduledRunInTaskTimeZone.clone().utc();

                if (nextScheduledRunInUTC.isAfter(todayEndUTC)) {
                    break;
                }

                if (nextScheduledRunInUTC.isBefore(taskCreatedInUTC)) {
                    console.log(`Skipped next run time due to nextScheduledRunInUTC ${nextScheduledRunInUTC.format('YYYY-MM-DD HH:mm:ss')} < taskCreatedInUTC ${taskCreatedInUTC.format('YYYY-MM-DD HH:mm:ss')}`);
                    continue;
                }

                await queryRunner.query(
                    'INSERT INTO task_schedule (task_id, scheduled_time, status) VALUES ($1, $2, $3)',
                    [task.id, nextScheduledRunInUTC.toISOString(), ExecutionStatus.Scheduled]
                );

                nextScheduledRunInUTC = moment(cronInterval.next().toDate()).utc();
            }
        }

        await queryRunner.commitTransaction();
    } catch (err) {
        console.error('Error during transaction, rolling back...', err);
        await queryRunner.rollbackTransaction();
        console.log('Transaction rolled back.');
    } finally {
        await queryRunner.release();
    }
}

export { scheduleTasks };
