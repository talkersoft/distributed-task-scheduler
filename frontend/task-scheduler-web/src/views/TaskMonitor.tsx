/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/views/TaskMonitor.tsx */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchScheduledTasksSummary } from '../redux/taskSlice';
import LineGraph from 'storybook/src/stories/LineGraph/LineGraph';
import './task-monitor.scss';
import moment from 'moment-timezone';

const TaskMonitor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const scheduledTasksSummary = useSelector((state: RootState) => state.tasks.scheduledTasksSummary);
  const currentInstances = scheduledTasksSummary.length > 0 ? scheduledTasksSummary[0].current_number_of_instances : 0;

  useEffect(() => {
    dispatch(fetchScheduledTasksSummary());
  }, [dispatch]);

  const now = moment.utc();
  const threeHoursLater = now.clone().add(3, 'hours');
  const filteredData = scheduledTasksSummary
    .filter(task => {
      const taskTime = moment.utc(task.scheduled_time);
      return taskTime.isBetween(now, threeHoursLater);
    })
    .map(task => ({
      ...task,
      scheduled_time: moment.utc(task.scheduled_time).local().format('YYYY-MM-DD HH:mm:ss')
    }));

  return (
    <div className="task-monitor">
      <h1>Task Monitor</h1>
      <LineGraph 
        data={filteredData} 
        thresholdLabel="Available Instances" 
        thresholdValue={currentInstances} 
      />
    </div>
  );
};

export default TaskMonitor;
