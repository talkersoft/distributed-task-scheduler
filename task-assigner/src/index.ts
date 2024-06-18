import { Client } from 'pg';

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});

client.connect()
  .then(() => {
    console.log('Connected to the database');

    setInterval(async () => {
      try {
        // Query to get new tasks that are not in task_executions
        const newTasksQuery = `
          SELECT * FROM tasks
          WHERE id NOT IN (SELECT task_id FROM task_executions)
          AND scheduled_execution_time <= NOW()
        `;
        //HERE WE NEED ALL TASK_EXECUTIONS
        // FROM BEGINING OF TIME TILL 1 MIN into the future which have the status of 'Scheduled'.
        
        const res = await client.query(newTasksQuery);

        for (const task of res.rows) {
          const insertQuery = `
            INSERT INTO task_executions (task_id, start_time, end_time, status)
            VALUES ($1, $2, NULL, 'Scheduled')
          `;
          const values = [task.id, task.scheduled_execution_time];

          await client.query(insertQuery, values);
          console.log(`Inserted task execution for task ID: ${task.id}`);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error inserting task executions', err.stack);
        } else {
          console.error('Unknown error', err);
        }
      }
    }, 1000);
  })
  .catch((err) => {
    if (err instanceof Error) {
      console.error('Connection error', err.stack);
    } else {
      console.error('Unknown error', err);
    }
  });
