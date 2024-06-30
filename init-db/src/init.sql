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
  time_zone VARCHAR(255),
  task_created TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_execution_time ON tasks(scheduled_execution_time);
CREATE INDEX IF NOT EXISTS idx_tasks_task_type_id ON tasks(task_type_id);

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
  latency BIGINT GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (start_time - scheduled_time)) * 1000) STORED,
  elapsed_execution_time BIGINT GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time)) * 1000) STORED,
  elapsed_time BIGINT GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - scheduled_time)) * 1000) STORED
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
    ts.start_time IS NOT NULL
    AND ts.end_time IS NOT NULL
    AND ts.scheduled_time >= NOW() - INTERVAL '1 YEAR'
GROUP BY
    tt.id, tt.name;

CREATE OR REPLACE VIEW scheduled_tasks_summary AS
WITH ScheduledTasks AS (
    SELECT
        tt.id AS task_type_id,
        tt.name AS task_type_name,
        ts.scheduled_time,
        COUNT(*) AS no_of_tasks,
        SUM(ROUND(aet.average_elapsed_time, 2)) AS required_compute_time
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
),
AggregatedTasks AS (
    SELECT
        scheduled_time,
        SUM(required_compute_time) AS required_compute_time,
        SUM(no_of_tasks) AS no_of_tasks
    FROM
        ScheduledTasks
    GROUP BY
        scheduled_time
)
SELECT
    at.scheduled_time,
    at.required_compute_time,
    at.no_of_tasks,
    c.value as current_number_of_instances,
    CEIL(at.required_compute_time / 9000.0) as required_instances
FROM
    AggregatedTasks at
JOIN
    configuration c 
ON 
    c.key = 'number_of_instances'
ORDER BY
    at.scheduled_time;

INSERT INTO configuration (key, value)
VALUES ('number_of_instances', '3')
ON CONFLICT (key) DO NOTHING;

DO $$ 
DECLARE 
  tasks_count INT;
BEGIN
  SELECT COUNT(*) INTO tasks_count FROM tasks;
  IF tasks_count = 0 THEN
    INSERT INTO tasks (name, task_type_id, cron_expression, task_details, is_recurring, time_zone, task_created)
    VALUES 
    --('Task 1', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '18 01 29 6 *', '{"message": "Build Software"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC'),
    ('Task 2', (SELECT id FROM task_types WHERE name = 'notification' LIMIT 1), '*/1 * * * *', '{"message": "Update Software"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC');
    -- ('Task 3', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/5 * * * *', '{"message": "Book a flight"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC'),
    -- ('Task 4', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/5 * * * *', '{"message": "Walk the dog"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC'),
    -- ('Task 5', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/5 * * * *', '{"message": "Feed the cat"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC'),
    -- ('Task 6', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/5 * * * *', '{"message": "Water the plants"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC'),
    -- ('Task 7', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/5 * * * *', '{"message": "Take out the trash"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC'),
    -- ('Task 8', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/5 * * * *', '{"message": "Make the bed"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC'),
    -- ('Task 9', (SELECT id FROM task_types WHERE name = 'notification' LIMIT 1), '*/5 * * * *', '{"message": "Check mail"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC'),
    -- ('Task 10', (SELECT id FROM task_types WHERE name = 'reminder' LIMIT 1), '*/30 * * * *', '{"message": "Organize Files"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC'),
    -- ('Task 11', (SELECT id FROM task_types WHERE name = 'notification' LIMIT 1), '*/30 * * * *', '{"message": "Backup Data"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC'),
    -- ('Task 12', (SELECT id FROM task_types WHERE name = 'notification' LIMIT 1), '0 * * * *', '{"message": "Wash the dishes"}', TRUE, 'America/New_York', now() AT TIME ZONE 'UTC');
  END IF;
END $$;