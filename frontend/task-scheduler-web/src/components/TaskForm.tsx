/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/components/TaskForm.tsx */
import React, { useState, useEffect } from 'react';
import { TextInput } from 'storybook/src/stories/TextInput/TextInput';
import { DateTimeSelector } from 'storybook/src/stories/DateTimeSelector/DateTimeSelector';
import RadioOptions from 'storybook/src/stories/RadioOptions/RadioOptions';
import { DataSelector, Item } from 'storybook/src/stories/DataSelector/DataSelector';
import { isValidCron } from 'cron-validator';
import { ActionButton } from 'storybook/src/stories/ActionButton/ActionButton';
import './task-form.scss';
import moment from 'moment-timezone';

interface TaskFormProps {
  taskTypes: Item[];
  timeZones: Item[];
  onSave: (task: any) => void;
  onCancel: () => void;
  task?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskTypes, timeZones, onSave, onCancel, task }) => {
  const [name, setName] = useState(task?.name || '');
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState(task?.message || '');
  const [cronExpression, setCronExpression] = useState(task?.cron_expression || '');
  const [cronError, setCronError] = useState<string | undefined>(undefined);
  const [scheduledExecutionTime, setScheduledExecutionTime] = useState<Date | null>(
    task?.scheduled_execution_time ? new Date(task.scheduled_execution_time) : null
  );
  const [scheduledExecutionTimeError, setScheduledExecutionTimeError] = useState<string | undefined>(undefined);
  const [isRecurring, setIsRecurring] = useState(task?.is_recurring || false);
  const [taskType, setTaskType] = useState<Item | null>(null);
  const [taskTypeError, setTaskTypeError] = useState<string | undefined>(undefined);
  const defaultTimeZone = moment.tz.guess();
  const [timeZone, setTimeZone] = useState<Item | null>(
    timeZones.find((tz) => tz.key === (task?.time_zone || defaultTimeZone)) || null
  );
  const [timeZoneError, setTimeZoneError] = useState<string | undefined>(undefined);

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


  const [selectedScheduleType, setSelectedScheduleType] = useState(determineScheduleType(task));

  useEffect(() => {
    if (selectedScheduleType === 'Immediately') {
      setIsRecurring(false);
      setScheduledExecutionTime(null);
      setScheduledExecutionTimeError(undefined);
    } else if (selectedScheduleType === 'Recurring') {
      setIsRecurring(true);
      setScheduledExecutionTime(null);
      setScheduledExecutionTimeError(undefined);
    } else {
      setIsRecurring(false);
    }
  }, [selectedScheduleType]);

  useEffect(() => {
    const selectedType = taskTypes.find((type) => type.key === task?.task_type_id) || null;
    setTaskType(selectedType);
  }, [task, taskTypes]);

  const handleSave = () => {
    let isValid = true;

    if (name.length <= 1) {
      setNameError('Task name must be greater than 1 character');
      isValid = false;
    }

    if (!taskType) {
      setTaskTypeError('Task type is required');
      isValid = false;
    }

    if (!timeZone) {
      setTimeZoneError('Time zone is required');
      isValid = false;
    }

    if (selectedScheduleType === 'Schedule' && !scheduledExecutionTime) {
      setScheduledExecutionTimeError('Scheduled time is required');
      isValid = false;
    }

    if (selectedScheduleType === 'Recurring' && !isValidCron(cronExpression, { alias: true })) {
      setCronError('Invalid cron expression');
      isValid = false;
    }

    if (!isValid) {
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
            onChange={(value) => {
              setName(value);
              setNameError(undefined);
            }}
            isValid={nameError === undefined}
            errorMessage={nameError}
          />
        </div>
        <div className="form-section form-row">
          <div className="form-item">
            <DataSelector
              label="Select Task Type"
              items={taskTypes}
              onChange={(item) => {
                setTaskType(item);
                setTaskTypeError(undefined);
              }}
              placeholder="Select task type"
              selected={taskType?.key}
              isValid={taskTypeError === undefined}
              errorMessage={taskTypeError}
            />
          </div>
          <div className="form-item">
            <DataSelector
              label="Select Time Zone"
              items={timeZones}
              onChange={(item) => {
                setTimeZone(item);
                setTimeZoneError(undefined);
              }}
              placeholder="Select time zone"
              selected={timeZone?.key}
              isValid={timeZoneError === undefined}
              errorMessage={timeZoneError}
            />
          </div>
        </div>
        {selectedScheduleType === 'Schedule' && (
          <div className="form-section">
            <DateTimeSelector
              label="Scheduled Time"
              onChange={(date) => {
                setScheduledExecutionTime(date);
                setScheduledExecutionTimeError(undefined);
              }}
              selected={scheduledExecutionTime}
              isValid={scheduledExecutionTimeError === undefined}
              errorMessage={scheduledExecutionTimeError}
            />
          </div>
        )}
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
        <div className="form-section">
          <TextInput
            label="Task Message"
            placeholder="Enter task message"
            value={message}
            onChange={setMessage}
          />
        </div>

        <div className="form-section task-form-buttons">
          <ActionButton label="Cancel" onClick={onCancel} primary={false} size="large" />
          <ActionButton 
            label={selectedScheduleType === "Immediately" ? "Save/Run" : "Save"} 
            onClick={handleSave} 
            primary={true} 
            size="large" />
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
