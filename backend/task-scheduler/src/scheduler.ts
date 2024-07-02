// Copyright Talkersoft LLC
// /backend/task-scheduler/src/scheduler.ts
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

        const recurringTasks: Task[] = await queryRunner.query(`
            SELECT t.* 
            FROM tasks t
            LEFT JOIN task_schedule ts ON t.id = ts.task_id 
                AND ts.scheduled_time >= '${todayStartUTC.format('YYYY-MM-DD HH:mm:ss')}' 
                AND ts.scheduled_time < '${todayEndUTC.format('YYYY-MM-DD HH:mm:ss')}'
                AND ts.status = 'Scheduled'
            WHERE ts.id IS NULL
                AND t.is_recurring = true
                AND t.active = true
        `);

        for (const task of recurringTasks) {
            if (!task.cron_expression) {
                continue;
            }

            const taskCreatedInUTC: Moment = moment.utc(task.task_created);
            const options: ParserOptions = { currentDate: now.toDate(), tz: 'UTC' };
            const cronInterval = parseExpression(task.cron_expression, options);

            while (true) {
                const nextScheduledRunInUTC = moment(cronInterval.next().toDate());

                if (nextScheduledRunInUTC.isAfter(todayEndUTC)) {
                    break;
                }

                if (nextScheduledRunInUTC.isBefore(taskCreatedInUTC)) {
                    continue;
                }

                await queryRunner.query(
                    'INSERT INTO task_schedule (task_id, scheduled_time, status) VALUES ($1, $2, $3)',
                    [task.id, nextScheduledRunInUTC.toISOString(), ExecutionStatus.Scheduled]
                );
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
