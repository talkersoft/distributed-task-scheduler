import React, { useState, useEffect } from 'react';
import { TextInput } from 'storybook/src/stories/TextInput/TextInput';
import { DateSelector } from 'storybook/src/stories/DateSelector/DateSelector';
import RadioOptions from 'storybook/src/stories/RadioOptions/RadioOptions';
import { DataSelector, Item } from 'storybook/src/stories/DataSelector/DataSelector';
import { isValidCron } from 'cron-validator';
import { ActionButton } from 'storybook/src/stories/ActionButton/ActionButton';
import './task-form.scss';

interface TaskFormProps {
  taskTypes: Item[];
  timeZones: Item[];
  onSave: (task: any) => void;
  onCancel: () => void;
  task?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskTypes, timeZones, onSave, onCancel, task }) => {
  const [name, setName] = useState(task?.name || '');
  const [message, setMessage] = useState(task?.message || '');
  const [cronExpression, setCronExpression] = useState(task?.cron_expression || '');
  const [cronError, setCronError] = useState<string | undefined>(undefined);
  const [scheduledExecutionTime, setScheduledExecutionTime] = useState<Date | null>(
    task?.scheduled_execution_time ? new Date(task.scheduled_execution_time) : null
  );
  const [isRecurring, setIsRecurring] = useState(task?.is_recurring || false);
  const [taskType, setTaskType] = useState<Item | null>(null);
  const [timeZone, setTimeZone] = useState<Item | null>(
    timeZones.find((tz) => tz.key === task?.time_zone) || null
  );

  const determineScheduleType = (task: any) => {
    if (!task) {
      return 'Immediately';
    }
    if (task.is_recurring === true) {
      return 'Recurring';
    } else if (task.scheduled_execution_time) {
      return 'Schedule';
    }

    return 'Immediately';
  };

  useEffect(() => {
    const initialScheduleType = determineScheduleType(task);
    setInitialScheduleType(initialScheduleType);
    setSelectedScheduleType(initialScheduleType);
  }, [task]);

  const [initialScheduleType, setInitialScheduleType] = useState(determineScheduleType(task));
  const [selectedScheduleType, setSelectedScheduleType] = useState(determineScheduleType(task));

  useEffect(() => {
    if (selectedScheduleType === 'Immediately') {
      setIsRecurring(false);
      setScheduledExecutionTime(null);
    } else if (selectedScheduleType === 'Recurring') {
      setIsRecurring(true);
      setScheduledExecutionTime(null);
    } else {
      setIsRecurring(false);
    }
  }, [selectedScheduleType]);

  useEffect(() => {
    const selectedType = taskTypes.find((type) => type.key === task?.task_type_id) || null;
    setTaskType(selectedType);
  }, [task, taskTypes]);

  const handleSave = () => {
    if (selectedScheduleType === 'Recurring' && !isValidCron(cronExpression, { alias: true })) {
      setCronError('Invalid cron expression');
      return;
    }
    const updatedTask = {
      ...task,
      name,
      message,
      cron_expression: cronExpression,
      scheduled_execution_time: scheduledExecutionTime,
      is_recurring: isRecurring,
      task_type_id: taskType?.key,
      time_zone: timeZone?.key,
    };
    onSave(updatedTask);
  };

  return (
    <div className="task-form-container">
      <div className="task-form">
        <div className="form-section">
          <RadioOptions
            direction="horizontal"
            options={['Immediately', 'Recurring', 'Schedule']}
            onChange={setSelectedScheduleType}
            value={selectedScheduleType}
          />
        </div>
        <div className="form-section">
          <TextInput
            label="Task Name"
            placeholder="Enter task name"
            value={name}
            onChange={setName}
          />
          <TextInput
            label="Task Message"
            placeholder="Enter task message"
            value={message}
            onChange={setMessage}
          />
        </div>
        <div className="form-section form-row">
          <div className="form-item">
            <DataSelector
              label="Select Task Type"
              items={taskTypes}
              onChange={(item) => setTaskType(item)}
              placeholder="Select task type"
              selected={taskType?.key}
            />
          </div>
          <div className="form-item">
            <DataSelector
              label="Select Time Zone"
              items={timeZones}
              onChange={(item) => setTimeZone(item)}
              placeholder="Select time zone"
              selected={timeZone?.key}
            />
          </div>
        </div>
        {selectedScheduleType === 'Recurring' && (
          <div className="form-section">
            <TextInput
              label="Cron Expression"
              placeholder="Enter cron expression"
              value={cronExpression}
              onChange={(value) => {
                setCronExpression(value);
                const valid = isValidCron(value, { alias: true });
                setCronError(valid ? undefined : 'Invalid cron expression');
              }}
              isValid={cronError === undefined}
              errorMessage={cronError}
            />
          </div>
        )}
        {selectedScheduleType === 'Schedule' && (
          <div className="form-section">
            <DateSelector onChange={(date) => setScheduledExecutionTime(date)} selected={scheduledExecutionTime} />
          </div>
        )}
        <div className="form-section task-form-buttons">
          <ActionButton label="Cancel" onClick={onCancel} primary={false} size="large" />
          <ActionButton label="Save" onClick={handleSave} primary={true} size="large" />
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
