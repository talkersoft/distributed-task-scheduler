import React, { useState, useEffect } from 'react';
import { TextInput } from 'storybook/src/stories/TextInput/TextInput';
import { DateSelector } from 'storybook/src/stories/DateSelector/DateSelector';
import RadioOptions from 'storybook/src/stories/RadioOptions/RadioOptions';
import { DataSelector, Item } from 'storybook/src/stories/DataSelector/DataSelector';
import { isValidCron } from 'cron-validator';
import './task-form.scss';

interface TaskFormProps {
  taskTypes: Item[];
  timeZones: Item[];
  onSave: (task: any) => void;
  onCancel: () => void;
  task?: any; // Optional task prop for editing
}

const TaskForm: React.FC<TaskFormProps> = ({ taskTypes, timeZones, onSave, onCancel, task }) => {
  const [name, setName] = useState(task?.name || '');
  const [cronExpression, setCronExpression] = useState(task?.cron_expression || '');
  const [cronError, setCronError] = useState<string | undefined>(undefined);
  const [scheduledExecutionTime, setScheduledExecutionTime] = useState<Date | null>(
    task?.scheduled_execution_time ? new Date(task.scheduled_execution_time) : null
  );
  const [isRecurring, setIsRecurring] = useState(task?.is_recurring || false);
  const [taskType, setTaskType] = useState<Item | null>(
    taskTypes.find((type) => type.key === task?.task_type) || null
  );
  const [timeZone, setTimeZone] = useState<Item | null>(
    timeZones.find((tz) => tz.key === task?.time_zone) || null
  );
  const [scheduleType, setScheduleType] = useState(
    task?.is_recurring ? 'Recurring' : task?.scheduled_execution_time ? 'Schedule' : 'Immediately'
  );

  useEffect(() => {
    if (scheduleType === 'Immediately') {
      setIsRecurring(false);
      setScheduledExecutionTime(null);
    } else if (scheduleType === 'Recurring') {
      setIsRecurring(true);
      setScheduledExecutionTime(null);
    } else {
      setIsRecurring(false);
    }
  }, [scheduleType]);

  const handleSave = () => {
    if (scheduleType === 'Recurring' && !isValidCron(cronExpression, { alias: true })) {
      setCronError('Invalid cron expression');
      return;
    }
    const updatedTask = {
      ...task,
      name,
      cronExpression,
      scheduledExecutionTime,
      isRecurring,
      taskType: taskType?.key,
      timeZone: timeZone?.key,
    };
    onSave(updatedTask);
  };

  return (
    <div className="task-form">
      <RadioOptions
        direction="horizontal"
        options={['Immediately', 'Recurring', 'Schedule']}
        onChange={setScheduleType}
        value={scheduleType} // Set the current value
      />
      <TextInput
        label="Task Name"
        placeholder="Enter task name"
        value={name}
        onChange={setName}
      />
      <div className="form-row">
        <div className="form-item">
          <DataSelector
            items={taskTypes}
            onChange={(item) => setTaskType(item)}
            placeholder="Select task type"
            selected={taskType?.key}
          />
        </div>
        <div className="form-item">
          <DataSelector
            items={timeZones}
            onChange={(item) => setTimeZone(item)}
            placeholder="Select time zone"
            selected={timeZone?.key}
          />
        </div>
      </div>
      {scheduleType === 'Recurring' && (
        <TextInput
          label="Cron Expression"
          placeholder="Enter cron expression"
          value={cronExpression}
          onChange={(value) => {
            setCronExpression(value);
            if (!isValidCron(value, { alias: true })) {
              setCronError('Invalid cron expression');
            } else {
              setCronError(undefined);
            }
          }}
          errorMessage={cronError}
        />
      )}
      {scheduleType === 'Schedule' && (
        <DateSelector onChange={(date) => setScheduledExecutionTime(date)} selected={scheduledExecutionTime} />
      )}
      <div className="task-form-buttons">
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default TaskForm;
