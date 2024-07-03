/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/views/TaskMetrics.tsx */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchTaskSummary } from '../redux/taskSummarySlice';
import './task-metrics.scss';

const TaskMetrics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const taskSummary = useSelector((state: RootState) => state.taskSummary.taskSummary);
  const status = useSelector((state: RootState) => state.taskSummary.status);
  const error = useSelector((state: RootState) => state.taskSummary.error);

  useEffect(() => {
    dispatch(fetchTaskSummary());
  }, [dispatch]);

  return (
    <div className="task-metrics">
      <h1>Task Metrics</h1>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'failed' && <div>{error}</div>}
      {status === 'succeeded' && (
        <table>
          <thead>
            <tr>
              <th>Task Type</th>
              <th>Average Elapsed Time (seconds)</th>
            </tr>
          </thead>
          <tbody>
            {taskSummary.map((task) => (
              <tr key={task.task_type_id}>
                <td>{task.task_type_name}</td>
                <td>{(parseFloat(task.average_elapsed_time) / 1000).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskMetrics;
