CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS task_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL
);

INSERT INTO task_types (id, name)
SELECT uuid_generate_v4(), 'reminder'
WHERE NOT EXISTS (
    SELECT 1 FROM task_types WHERE name = 'reminder'
);

INSERT INTO task_types (id, name)
SELECT uuid_generate_v4(), 'notification'
WHERE NOT EXISTS (
    SELECT 1 FROM task_types WHERE name = 'notification'
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  task_type_id UUID NOT NULL REFERENCES task_types(id),
  cron_expression VARCHAR(255),
  task_details JSONB,
  scheduled_execution_time TIMESTAMP,
  is_recurring BOOLEAN DEFAULT FALSE,
  task_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_execution_time ON tasks(scheduled_execution_time);

DO $$ BEGIN
  CREATE TYPE execution_status AS ENUM ('Scheduled', 'Queued', 'Processing', 'Completed', 'Failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS task_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id),
  scheduled_time TIMESTAMP,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status execution_status,
  elapsed_time BIGINT GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time)) * 1000) STORED
);

CREATE INDEX IF NOT EXISTS idx_task_executions_scheduled_time ON task_schedule(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_task_executions_task_id ON task_schedule(task_id);

CREATE TABLE IF NOT EXISTS configuration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value VARCHAR(255) NOT NULL
);

CREATE OR REPLACE VIEW average_elapsed_time_per_task_type AS
SELECT
    tt.id AS task_type_id,
    tt.name AS task_type_name,
    AVG(ts.elapsed_time) AS average_elapsed_time
FROM
    task_types tt
JOIN
    tasks t ON tt.id = t.task_type_id
JOIN
    task_schedule ts ON t.id = ts.task_id
WHERE
    ts.start_time IS NOT NULL AND ts.end_time IS NOT NULL
GROUP BY
    tt.id, tt.name;

CREATE OR REPLACE VIEW scheduled_tasks_summary AS
WITH ScheduledTasks AS (
    SELECT
        tt.id AS task_type_id,
        tt.name AS task_type_name,
        ts.scheduled_time,
        COUNT(*) AS no_of_tasks,
        SUM(aet.average_elapsed_time) AS total_elapsed_time
    FROM
        task_schedule ts
    JOIN
        tasks t ON ts.task_id = t.id
    JOIN
        task_types tt ON t.task_type_id = tt.id
    JOIN
        average_elapsed_time_per_task_type aet ON tt.id = aet.task_type_id
    WHERE
        ts.status = 'Scheduled'
    GROUP BY
        tt.id, tt.name, ts.scheduled_time
)
SELECT
    scheduled_time,
    SUM(total_elapsed_time) AS total_elapsed_time,
    SUM(no_of_tasks) AS no_of_tasks
FROM
    ScheduledTasks
GROUP BY
    scheduled_time
ORDER BY
    scheduled_time;

INSERT INTO configuration (key, value)
VALUES ('number_of_instances', '1')
ON CONFLICT (key) DO NOTHING;

DO $$ 
DECLARE 
  tasks_count INT;
BEGIN
  SELECT COUNT(*) INTO tasks_count FROM tasks;

  IF tasks_count = 0 THEN
    INSERT INTO tasks (name, task_type_id, cron_expression, task_details, is_recurring)
    VALUES 
      ('Task 1', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/1 * * * *', '{"message": "Walk the dog."}', TRUE),
      ('Task 2', (SELECT id FROM task_types WHERE name = 'notification' LIMIT 1), '*/1 * * * *', '{"message": "Update Software"}', TRUE),
      ('Task 3', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/5 * * * *', '{"message": "Book a flight"}', TRUE),
      ('Task 4', (SELECT id FROM task_types WHERE name = 'notification' LIMIT 1), '*/5 * * * *', '{"message": "Workout Session"}', TRUE),
      ('Task 5', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/5 * * * *', '{"message": "Check mail"}', TRUE),
      ('Task 6', (SELECT id FROM task_types WHERE name = 'notification' LIMIT 1), '*/30 * * * *', '{"message": "Organize Files"}', TRUE),
      ('Task 7', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/30 * * * *', '{"message": "Call mom"}', TRUE),
      ('Task 8', (SELECT id FROM task_types WHERE name = 'notification' LIMIT 1), '*/30 * * * *', '{"message": "Backup Data"}', TRUE);
  END IF;
END $$;
