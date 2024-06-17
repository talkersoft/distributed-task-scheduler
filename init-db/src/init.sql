CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS task_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL
);

INSERT INTO task_types (name)
SELECT 'reminder'
WHERE NOT EXISTS (
    SELECT 1 FROM task_types WHERE name = 'reminder'
);

INSERT INTO task_types (name)
SELECT 'notification'
WHERE NOT EXISTS (
    SELECT 1 FROM task_types WHERE name = 'notification'
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type_id UUID NOT NULL REFERENCES task_types(id),
  cron_expression VARCHAR(255),
  task_details JSONB,
  next_execution TIMESTAMP,
  is_recurring BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id),
  message TEXT,
  log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$ BEGIN
  CREATE TYPE execution_status AS ENUM ('Started', 'Completed', 'Failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS task_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status execution_status
);
