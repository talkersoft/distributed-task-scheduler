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
    const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())); // Current time in UTC without milliseconds

    const newTasksQuery = `
      SELECT ts.id, ts.task_id, ts.scheduled_time, t.task_details, t.name
      FROM task_schedule ts
      JOIN tasks t ON ts.task_id = t.id
      WHERE ts.scheduled_time <= $1
      AND ts.status = 'Scheduled'
      ORDER BY ts.scheduled_time
    `;

    const res = await queryRunner.query(newTasksQuery, [nowUTC.toISOString()]);

    for (const row of res) {
      const taskDetails = row.task_details;
      const message = taskDetails.message;
      const taskScheduleId = row.id;
      const taskName = row.name;

      console.log(`Publishing task: ${row.id}, name: ${taskName}, scheduled_time: ${row.scheduled_time}, current UTC time: ${nowUTC.toISOString()}, message: ${message}`);

      const payload = {
        taskScheduleId: taskScheduleId,
        name: taskName,
        metadata: taskDetails,
      };

      try {
        // Update task status to 'Queued'
        await queryRunner.query(
          `
          UPDATE task_schedule
          SET status = 'Queued'
          WHERE id = $1
          `,
          [taskScheduleId]
        );

        // Publish the task to RabbitMQ
        await publishToRabbitMQ(JSON.stringify(payload));

        console.log(`Task ${taskScheduleId} published successfully.`);
      } catch (publishError) {
        console.error(`Failed to publish task ${taskScheduleId}`, publishError);

        // Update task status back to 'Scheduled' if publishing fails
        await queryRunner.query(
          `
          UPDATE task_schedule
          SET status = 'Scheduled'
          WHERE id = $1
          `,
          [taskScheduleId]
        );
        console.log(`Task status reverted to 'Scheduled' for task: ${taskScheduleId}`);
      }
    }

    await queryRunner.commitTransaction();
  } catch (err) {
    console.error('Error during transaction, rolling back...', err);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
}

export { distributeTasks, DistributorConfig };
