// Copyright Talkersoft LLC
// /backend/task-distributor/src/distributor.ts
import { AppDataSource } from 'task-entities';
import { publishToRabbitMQ } from './publishToRabbitMQ';

interface DistributorConfig {
  throttleInterval: number;
}

async function distributeTasks(config: DistributorConfig) {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const now = new Date();
    const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

    const newTasksQuery = `
      SELECT ts.id, ts.task_id, ts.scheduled_time, t.task_details, t.name, tt.name as task_type_name
      FROM task_schedule ts
      JOIN tasks t ON ts.task_id = t.id
      JOIN task_types tt ON tt.id = t.task_type_id
      WHERE ts.scheduled_time <= $1
      AND ts.status = 'Scheduled'
      AND t.active = true
      ORDER BY ts.scheduled_time;
    `;

    const res = await queryRunner.query(newTasksQuery, [nowUTC.toISOString()]);

    for (const row of res) {
      const taskDetails = row.task_details;
      const message = taskDetails.message;
      const taskScheduleId = row.id;
      const taskName = row.name;
      const taskTypeName = row.task_type_name;

      const payload = {
        taskScheduleId: taskScheduleId,
        name: taskName,
        taskType: taskTypeName,
        message: message,
      };

      try {
        await queryRunner.query(
          `
          UPDATE task_schedule
          SET status = 'InFlight'
          WHERE id = $1
          `,
          [taskScheduleId]
        );

        await queryRunner.commitTransaction();

        await queryRunner.startTransaction();

        await publishToRabbitMQ(JSON.stringify(payload));

        await queryRunner.query(
          `
          UPDATE task_schedule
          SET status = 'Queued'
          WHERE id = $1
          `,
          [taskScheduleId]
        );

      } catch (publishError) {
        console.error(`Failed to publish task ${taskScheduleId}`, publishError);

        await queryRunner.query(
          `
          UPDATE task_schedule
          SET status = 'Scheduled'
          WHERE id = $1
          `,
          [taskScheduleId]
        );
      }

      await queryRunner.commitTransaction();
    }
  } catch (err) {
    console.error('Error during transaction, rolling back...', err);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
}

export { distributeTasks, DistributorConfig };
