import React, { useState, useEffect } from 'react';
import { TextInput } from 'storybook/src/stories/TextInput/TextInput';
import { DateSelector } from 'storybook/src/stories/DateSelector/DateSelector';
import { RadioOptions } from 'storybook/src/stories/RadioOptions/RadioOptions';
import { DataSelector, Item } from 'storybook/src/stories/DataSelector/DataSelector';
import './task-form.scss';

interface TaskFormProps {
  taskTypes: Item[];
  timeZones: Item[];
  onSave: (task: any) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskTypes, timeZones, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [cronExpression, setCronExpression] = useState('');
  const [scheduledExecutionTime, setScheduledExecutionTime] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [taskType, setTaskType] = useState<Item | null>(null);
  const [timeZone, setTimeZone] = useState<Item | null>(null);
  const [scheduleType, setScheduleType] = useState('Immediately');

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
    const task = {
      name,
      cronExpression,
      scheduledExecutionTime,
      isRecurring,
      taskType: taskType?.key,
      timeZone: timeZone?.key,
    };
    onSave(task);
  };

  return (
    <div className="task-form">
       <RadioOptions
        direction="horizontal"
        options={['Immediately', 'Recurring', 'Schedule']}
        onChange={setScheduleType}
      />
      <TextInput
        label="Task Name"
        placeholder="Enter task name"
        value={name}
        onChange={setName}
      />
      {scheduleType === 'Recurring' && (
        <TextInput
          label="Cron Expression"
          placeholder="Enter cron expression"
          value={cronExpression}
          onChange={setCronExpression}
        />
      )}
      {scheduleType === 'Schedule' && (
        <DateSelector
          onChange={(date) => setScheduledExecutionTime(date)}
        />
      )}
     
      <DataSelector
        items={taskTypes}
        onChange={(item) => setTaskType(item)}
        placeholder="Select task type"
      />
      <DataSelector
        items={timeZones}
        onChange={(item) => setTimeZone(item)}
        placeholder="Select time zone"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default TaskForm;
