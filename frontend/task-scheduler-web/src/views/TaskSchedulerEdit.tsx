/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/views/TaskSchedulerEdit.tsx */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TaskForm from '../components/TaskForm';
import { RootState, AppDispatch } from '../redux/store';
import { fetchTaskTypes } from '../redux/taskTypeSlice';
import { Task, editTask } from '../redux/taskSlice';
import './task-scheduler.scss';
import moment from 'moment-timezone';

const TaskSchedulerEdit = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const task = useSelector((state: RootState) =>
    state.tasks.tasks.find((task: Task) => task.id === id)
  );
  const taskTypes = useSelector((state: RootState) => state.taskTypes.taskTypes).map((type: any) => ({ key: type.id, value: type.name }));
  const timeZones = moment.tz.names().map((tz) => ({ key: tz, value: tz }));

  useEffect(() => {
    if (taskTypes.length === 0) {
      dispatch(fetchTaskTypes());
    }
  }, [dispatch, taskTypes.length]);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (task && taskTypes.length > 0) {
      setIsReady(true);
    }
  }, [task, taskTypes]);

  const handleSaveTask = (updatedTask: Task) => {
    if (updatedTask.is_recurring) {
      updatedTask.cron_expression = updatedTask.cron_expression || '';
      updatedTask.scheduled_execution_time = undefined;
    } else if (updatedTask.scheduled_execution_time) {
      updatedTask.cron_expression = '';
      updatedTask.scheduled_execution_time = moment.utc(updatedTask.scheduled_execution_time).toISOString();
    } else {
      updatedTask.cron_expression = '';
      updatedTask.scheduled_execution_time = undefined;
    }
    dispatch(editTask(updatedTask)).then(() => {
      navigate('/task-scheduler');
    });
  };

  const handleCancel = () => {
    navigate('/task-scheduler');
  };

  return (
    <div className="task-scheduler">
      {isReady && task && (
        <TaskForm
          taskTypes={taskTypes}
          timeZones={timeZones}
          onSave={handleSaveTask}
          onCancel={handleCancel}
          task={task}
        />
      )}
    </div>
  );
};

export default TaskSchedulerEdit;
