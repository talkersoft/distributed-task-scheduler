// src/views/TaskSchedulerEdit.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TaskForm from '../components/TaskForm';
import { RootState } from '../redux/store';
import { Task } from '../redux/taskSlice';
import './task-scheduler.scss';
import moment from 'moment-timezone';

const TaskSchedulerEdit = () => {
  const { id } = useParams<{ id: string }>();
  const task = useSelector((state: RootState) =>
    state.tasks.tasks.find((task: Task) => task.id === id)
  );
  const taskTypes = useSelector((state: RootState) => state.taskTypes.taskTypes).map((type: any) => ({ key: type.id, value: type.name }));
  const timeZones = moment.tz.names().map((tz) => ({ key: tz, value: tz }));

  const handleSaveTask = (updatedTask: Task) => {
    console.log('Save task:', updatedTask);
    // Save task logic here
  };

  return (
    <div className="task-scheduler">
      {task && (
        <TaskForm
          taskTypes={taskTypes}
          timeZones={timeZones}
          onSave={handleSaveTask}
          onCancel={() => console.log('Cancel')}
          task={task}
        />
      )}
    </div>
  );
};

export default TaskSchedulerEdit;
