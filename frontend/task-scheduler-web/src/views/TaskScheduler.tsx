/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/views/TaskScheduler.tsx */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/TaskList';
import { fetchTasks, setTaskInactive } from '../redux/taskSlice';
import { fetchTaskTypes } from '../redux/taskTypeSlice';
import { RootState, AppDispatch } from '../redux/store';
import './task-scheduler.scss';
import { ActionButton } from 'storybook/src/stories/ActionButton/ActionButton';
import Modal from 'react-modal';

const TaskScheduler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const taskStatus = useSelector((state: RootState) => state.tasks.status);
  const taskTypesStatus = useSelector((state: RootState) => state.taskTypes.status);
  const error = useSelector((state: RootState) => state.tasks.error);
  const taskTypes = useSelector((state: RootState) => state.taskTypes.taskTypes);
  
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<any>(null);

  useEffect(() => {
    if (tasks.length === 0 && taskStatus !== 'loading') {
      dispatch(fetchTasks());
    }
    if (taskTypes.length === 0 && taskTypesStatus !== 'loading') {
      dispatch(fetchTaskTypes());
    }
  }, [tasks, taskStatus, taskTypes, taskTypesStatus, dispatch]);

  const handleEditTask = (task: any) => {
    navigate(`/task-scheduler/edit/${task.id}`);
  };

  const handleDeleteTask = (task: any) => {
    setTaskToDelete(task);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      dispatch(setTaskInactive(taskToDelete.id));
      setShowDeleteConfirmation(false);
      setTaskToDelete(null);
    }
  };

  const cancelDeleteTask = () => {
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
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
        {taskStatus === 'succeeded' && <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />}
        {taskStatus === 'failed' && <div>{error}</div>}
      </div>
      <Modal
        isOpen={showDeleteConfirmation}
        onRequestClose={cancelDeleteTask}
        className="modal"
        overlayClassName="overlay"
      >
        <p>Are you sure you want to delete the task "{taskToDelete?.name}"?</p>
        <div className="modal-actions">
          <ActionButton label="Yes" onClick={confirmDeleteTask} primary={true} />
          <ActionButton label="No" onClick={cancelDeleteTask} />
        </div>
      </Modal>
    </>
  );
};

export default TaskScheduler;
