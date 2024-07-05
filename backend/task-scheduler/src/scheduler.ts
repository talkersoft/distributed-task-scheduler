// Copyright Talkersoft LLC
// /backend/task-scheduler/src/scheduler.ts
import { AppDataSource, Task, ExecutionStatus } from 'task-entities';
import { parseExpression, ParserOptions } from 'cron-parser';
import moment, { Moment } from 'moment-timezone';

async function fetchRecurringTasks(dayStartUTC: Moment, dayEndUTC: Moment) {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
        await queryRunner.connect();
        const recurringTasks: Task[] = await queryRunner.query(`
            SELECT t.* 
            FROM tasks t
            LEFT JOIN task_schedule ts ON t.id = ts.task_id 
                AND ts.scheduled_time >= '${dayStartUTC.format('YYYY-MM-DD HH:mm:ss')}' 
                AND ts.scheduled_time < '${dayEndUTC.format('YYYY-MM-DD HH:mm:ss')}'
                AND ts.status = 'Scheduled'
            WHERE ts.id IS NULL
                AND t.is_recurring = true
                AND t.active = true
        `);
        return recurringTasks;
    } finally {
        await queryRunner.release();
    }
}

async function scheduleTask(task: Task, dayEndUTC: Moment) {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const taskCreatedInUTC: Moment = moment.utc(task.task_created);
        const formattedBeginDate = moment().tz(task.time_zone).format('YYYY-MM-DD HH:mm:ss');
        const options: ParserOptions = { currentDate: formattedBeginDate, tz: task.time_zone };
        
        if (!task.cron_expression) {
            throw new Error(`Task ${task.id} does not have a valid cron expression.`);
        }

        const cronInterval = parseExpression(task.cron_expression, options);

        let scheduledCount = 0;
        while (true) {
            const nextInterval = cronInterval.next().toDate();
            const nextScheduledRunInUTC = moment(nextInterval);

            if (nextScheduledRunInUTC.isAfter(dayEndUTC)) break;
            if (nextScheduledRunInUTC.isBefore(taskCreatedInUTC)) continue;

            await queryRunner.query(
                'INSERT INTO task_schedule (task_id, scheduled_time, status) VALUES ($1, $2, $3)',
                [task.id, nextScheduledRunInUTC.toISOString(), ExecutionStatus.Scheduled]
            );

            scheduledCount++;
        }

        if (scheduledCount > 0) {
            console.log(`Scheduled ${scheduledCount} tasks for ${task.name} for ${dayEndUTC.format('MM/DD/YYYY')}`);
        }

        await queryRunner.commitTransaction();
    } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error('Error during transaction, rolling back...', err);
    } finally {
        await queryRunner.release();
    }
}

async function scheduleTasks() {
    const now: Moment = moment().utc();
    const todayStartUTC: Moment = now.clone().startOf('day');
    const todayEndUTC: Moment = now.clone().endOf('day'); 

    await scheduleTasksForDay(todayStartUTC, todayEndUTC);

    if (now.hours() === 23 && now.minutes() === 59) {
        const nextDayStartUTC: Moment = todayEndUTC.clone().add(1, 'second');
        const nextDayEndUTC: Moment = nextDayStartUTC.clone().endOf('day');
        await scheduleTasksForDay(nextDayStartUTC, nextDayEndUTC);
    }
}

async function scheduleTasksForDay(dayStartUTC: Moment, dayEndUTC: Moment) {
    try {
        const recurringTasks = await fetchRecurringTasks(dayStartUTC, dayEndUTC);
        for (const task of recurringTasks) {
            if (task.cron_expression) {
                await scheduleTask(task, dayEndUTC);
            }
        }
    } catch (err) {
        console.error('Error scheduling tasks:', err);
    }
}

export { scheduleTasks, fetchRecurringTasks, scheduleTask };
