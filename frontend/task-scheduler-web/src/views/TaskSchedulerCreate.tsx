/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/views/TaskSchedulerCreate.tsx */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskForm from '../components/TaskForm';
import { RootState, AppDispatch } from '../redux/store';
import { createTask } from '../redux/taskSlice';
import { Task } from '../redux/taskSlice';
import './task-scheduler.scss';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom';
import { fetchTaskTypes } from '../redux/taskTypeSlice';

const TaskSchedulerCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const taskTypes = useSelector((state: RootState) => state.taskTypes.taskTypes).map((type: any) => ({ key: type.id, value: type.name }));
  const timeZones = moment.tz.names().map((tz) => ({ key: tz, value: tz }));

  useEffect(() => {
    if (taskTypes.length === 0) {
      dispatch(fetchTaskTypes());
    }
  }, [dispatch, taskTypes.length]);

  const handleSaveTask = (task: Task) => {
    if (!task.is_recurring && task.scheduled_execution_time) {
      task.scheduled_execution_time = moment.utc(task.scheduled_execution_time).toISOString();
    }
    dispatch(createTask(task)).then(() => {
      navigate('/task-scheduler');
    });
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
