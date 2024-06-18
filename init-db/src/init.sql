CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create task_types table
CREATE TABLE IF NOT EXISTS task_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL
);

-- Insert task types if they do not exist
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

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type_id UUID NOT NULL REFERENCES task_types(id),
  cron_expression VARCHAR(255),
  task_details JSONB,
  scheduled_execution_time TIMESTAMP,
  is_recurring BOOLEAN DEFAULT FALSE
);

-- Create an index on scheduled_execution_time for faster search
CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_execution_time ON tasks(scheduled_execution_time);

-- Create execution_status type if it does not exist
DO $$ BEGIN
  CREATE TYPE execution_status AS ENUM ('Scheduled', 'Queued', 'Started', 'Completed', 'Failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create task_schedule table
CREATE TABLE IF NOT EXISTS task_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id),
  scheduled_execution_time TIMESTAMP,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status execution_status,
  elapsed_time BIGINT GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time)) * 1000) STORED
);

-- Create indexes on task_executions
CREATE INDEX IF NOT EXISTS idx_task_executions_start_time ON task_schedule(start_time);
CREATE INDEX IF NOT EXISTS idx_task_executions_task_id ON task_schedule(task_id);

-- Create configuration table
CREATE TABLE IF NOT EXISTS configuration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value VARCHAR(255) NOT NULL
);

-- Insert configuration key if it does not exist
INSERT INTO configuration (key, value)
VALUES ('number_of_instances', '1')
ON CONFLICT (key) DO NOTHING;

-- Create or replace view average_execution_time
CREATE OR REPLACE VIEW average_execution_time AS
SELECT 
    tt.name AS task_type,
    AVG(ts.elapsed_time) AS avg_elapsed_time
FROM 
    task_schedule ts
JOIN 
    tasks t ON ts.task_id = t.id
JOIN 
    task_types tt ON t.task_type_id = tt.id
WHERE 
    ts.status = 'Completed'
GROUP BY 
    tt.name;

-- Create or replace view tasks_to_execute
CREATE OR REPLACE VIEW tasks_to_execute AS
SELECT
    tt.name AS task_type,
    COUNT(*) AS task_count,
    AVG(ts.elapsed_time) AS avg_elapsed_time
FROM
    tasks t
JOIN
    task_types tt ON t.task_type_id = tt.id
LEFT JOIN
    task_schedule ts ON t.id = ts.task_id
WHERE
    t.scheduled_execution_time BETWEEN NOW() AND NOW() + INTERVAL '1 hour'
GROUP BY
    tt.name;

-- Insert random tasks if the tasks table is empty
DO $$ 
DECLARE 
  task_type_id UUID;
  tasks_count INT;
BEGIN
  -- Check if the table is empty
  SELECT COUNT(*) INTO tasks_count FROM tasks;

  IF tasks_count = 0 THEN
    WITH random_tasks AS (
      SELECT 
        (NOW() + INTERVAL '3 minutes' + INTERVAL '1 second' * FLOOR(RANDOM() * 300)) AS scheduled_execution_time,
        jsonb_build_object('message', 
          CASE FLOOR(RANDOM() * 100)
            WHEN 0 THEN 'Take your dog to the vet'
            WHEN 1 THEN 'Doctor appointment'
            WHEN 2 THEN 'Do not forget to scoop the kitty litter'
            WHEN 3 THEN 'Meeting with client'
            WHEN 4 THEN 'Grocery shopping'
            WHEN 5 THEN 'Pay utility bills'
            WHEN 6 THEN 'Call mom'
            WHEN 7 THEN 'Car service appointment'
            WHEN 8 THEN 'Finish project report'
            WHEN 9 THEN 'Pick up dry cleaning'
            WHEN 10 THEN 'Workout session'
            WHEN 11 THEN 'Dinner with friends'
            WHEN 12 THEN 'Buy birthday gift'
            WHEN 13 THEN 'Submit tax documents'
            WHEN 14 THEN 'Book flight tickets'
            WHEN 15 THEN 'Attend conference call'
            WHEN 16 THEN 'Water the plants'
            WHEN 17 THEN 'Read a book'
            WHEN 18 THEN 'Update software'
            WHEN 19 THEN 'Renew car insurance'
            WHEN 20 THEN 'Plan weekend trip'
            WHEN 21 THEN 'Clean the house'
            WHEN 22 THEN 'Order groceries online'
            WHEN 23 THEN 'Prepare presentation'
            WHEN 24 THEN 'Visit dentist'
            WHEN 25 THEN 'Donate clothes'
            WHEN 26 THEN 'Make dinner reservations'
            WHEN 27 THEN 'Check mail'
            WHEN 28 THEN 'Research new project'
            WHEN 29 THEN 'Send follow-up emails'
            WHEN 30 THEN 'Write blog post'
            WHEN 31 THEN 'Organize files'
            WHEN 32 THEN 'Back up data'
            WHEN 33 THEN 'Call plumber'
            WHEN 34 THEN 'Buy new shoes'
            WHEN 35 THEN 'Attend yoga class'
            WHEN 36 THEN 'Repair bike'
            WHEN 37 THEN 'Plan birthday party'
            WHEN 38 THEN 'Review budget'
            WHEN 39 THEN 'Schedule hair appointment'
            WHEN 40 THEN 'Watch a movie'
            WHEN 41 THEN 'Attend webinar'
            WHEN 42 THEN 'Visit library'
            WHEN 43 THEN 'Buy concert tickets'
            WHEN 44 THEN 'Organize photos'
            WHEN 45 THEN 'Clean garage'
            WHEN 46 THEN 'Prepare meal plan'
            WHEN 47 THEN 'Call electrician'
            WHEN 48 THEN 'Buy new phone'
            WHEN 49 THEN 'Check tire pressure'
            WHEN 50 THEN 'Attend art exhibition'
            WHEN 51 THEN 'Go for a run'
            WHEN 52 THEN 'Update resume'
            WHEN 53 THEN 'Plan vacation'
            WHEN 54 THEN 'Wash car'
            WHEN 55 THEN 'Pay credit card bill'
            WHEN 56 THEN 'Get a massage'
            WHEN 57 THEN 'Play board games'
            WHEN 58 THEN 'Take a nap'
            WHEN 59 THEN 'Visit a friend'
            WHEN 60 THEN 'Write a letter'
            WHEN 61 THEN 'Buy a gift card'
            WHEN 62 THEN 'Attend a workshop'
            WHEN 63 THEN 'Clean the fridge'
            WHEN 64 THEN 'Donate to charity'
            WHEN 65 THEN 'Go hiking'
            WHEN 66 THEN 'Buy a new book'
            WHEN 67 THEN 'Organize pantry'
            WHEN 68 THEN 'Schedule doctor check-up'
            WHEN 69 THEN 'Check bank statement'
            WHEN 70 THEN 'Buy pet food'
            WHEN 71 THEN 'Plan a date night'
            WHEN 72 THEN 'Call a relative'
            WHEN 73 THEN 'Review insurance policy'
            WHEN 74 THEN 'Clean windows'
            WHEN 75 THEN 'Attend a fitness class'
            WHEN 76 THEN 'Repair laptop'
            WHEN 77 THEN 'Get a haircut'
            WHEN 78 THEN 'Buy new clothes'
            WHEN 79 THEN 'Plan a BBQ'
            WHEN 80 THEN 'Go to the park'
            WHEN 81 THEN 'Fix the fence'
            WHEN 82 THEN 'Buy a new watch'
            WHEN 83 THEN 'Check smoke detectors'
            WHEN 84 THEN 'Visit grandparents'
            WHEN 85 THEN 'Renew gym membership'
            WHEN 86 THEN 'Update social media'
            WHEN 87 THEN 'Write a poem'
            WHEN 88 THEN 'Learn a new recipe'
            WHEN 89 THEN 'Visit the beach'
            WHEN 90 THEN 'Get a car wash'
            WHEN 91 THEN 'Attend a networking event'
            WHEN 92 THEN 'Plant flowers'
            WHEN 93 THEN 'Organize a garage sale'
            WHEN 94 THEN 'Play a sport'
            WHEN 95 THEN 'Read the news'
            WHEN 96 THEN 'Meditate'
            WHEN 97 THEN 'Buy a camera'
            WHEN 98 THEN 'Host a dinner party'
            WHEN 99 THEN 'Go for a bike ride'
          END
        ) AS task_details
      FROM generate_series(1, 1000)
    )
    INSERT INTO tasks (task_type_id, scheduled_execution_time, cron_expression, task_details, is_recurring)
    SELECT
      (SELECT id FROM task_types WHERE name = 'notification' LIMIT 1) AS task_type_id,
      scheduled_execution_time,
      '',
      task_details,
      FALSE
    FROM random_tasks;
  END IF;

END $$;
