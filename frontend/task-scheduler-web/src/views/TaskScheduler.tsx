import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListTasks from '../components/ListTasks';
import { fetchTasks } from '../redux/taskSlice';
import { fetchTaskTypes } from '../redux/taskTypeSlice';
import { RootState, AppDispatch } from '../redux/store';
import './task-scheduler.scss';
import { ActionButton } from 'storybook/src/stories/ActionButton/ActionButton';

const TaskScheduler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const taskStatus = useSelector((state: RootState) => state.tasks.status);
  const taskTypes = useSelector((state: RootState) => state.taskTypes.taskTypes);
  const taskTypesStatus = useSelector((state: RootState) => state.taskTypes.status);
  const error = useSelector((state: RootState) => state.tasks.error);

  useEffect(() => {
    if (taskStatus === 'idle') {
      dispatch(fetchTasks());
    }
    if (taskTypesStatus === 'idle') {
      dispatch(fetchTaskTypes());
    }
  }, [taskStatus, taskTypesStatus, dispatch]);

  const handleEditTask = (task: any) => {
    navigate(`/task-scheduler/edit/${task.id}`);
  };

  const handleCreateTask = () => {
    navigate('/task-scheduler/create');
  };

  return (
    <>
      <div className="action-button-container">
        <ActionButton label="Create New Task" onClick={handleCreateTask} primary={true} size="large" />
      </div>
      <div className="task-scheduler">
        {taskStatus === 'loading' && <div>Loading...</div>}
        {taskStatus === 'succeeded' && <ListTasks tasks={tasks} onEdit={handleEditTask} />}
        {taskStatus === 'failed' && <div>{error}</div>}
      </div>
    </>
  );
};

export default TaskScheduler;
