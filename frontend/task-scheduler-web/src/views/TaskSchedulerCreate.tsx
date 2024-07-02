// src/views/TaskSchedulerCreate.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskForm from '../components/TaskForm';
import { RootState, AppDispatch } from '../redux/store';
import { Task } from '../redux/taskSlice';
import './task-scheduler.scss';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom';

const TaskSchedulerCreate = () => {
  const navigate = useNavigate();
  const taskTypes = useSelector((state: RootState) => state.taskTypes.taskTypes).map((type: any) => ({ key: type.id, value: type.name }));
  const timeZones = moment.tz.names().map((tz) => ({ key: tz, value: tz }));

  const handleSaveTask = (task: Task) => {
    console.log('Create task:', task);
    // Dispatch an action to save the new task
  };
  const handleCancel = () => {
    navigate('/task-scheduler');
  };
  return (
    <div className="task-scheduler">
      <TaskForm
        taskTypes={taskTypes}
        timeZones={timeZones}
        onSave={handleSaveTask}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default TaskSchedulerCreate;
