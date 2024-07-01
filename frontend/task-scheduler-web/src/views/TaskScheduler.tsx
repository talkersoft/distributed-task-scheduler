import React, { useState, useEffect } from 'react';
import TaskForm from './TaskSchedulerEdit';
import ListTasks from '../components/ListTasks';
import moment from 'moment-timezone';
import './task-scheduler.scss';

const TaskScheduler = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskTypes, setTaskTypes] = useState<any[]>([]);
  const [timeZones] = useState(moment.tz.names().map(tz => ({ key: tz, value: tz })));

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks`)
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));

    fetch(`${process.env.REACT_APP_API_URL}/task-types`)
      .then(response => response.json())
      .then(data => setTaskTypes(data.map((type: any) => ({ key: type.id, value: type.name }))))
      .catch(error => console.error('Error fetching task types:', error));
  }, []);

  const handleSaveTask = (task: any) => {
    // Save task logic here
  };

  return (
    <div className="task-scheduler">
      <ListTasks tasks={tasks} />
    </div>
  );
};

export default TaskScheduler;
