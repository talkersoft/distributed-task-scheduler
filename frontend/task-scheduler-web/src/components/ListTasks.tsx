import React from 'react';
import { DataGrid } from 'storybook/src/stories/DataGrid/DataGrid';
import './list-tasks.scss';

interface ListTasksProps {
  tasks: any[];
}

const ListTasks: React.FC<ListTasksProps> = ({ tasks }) => {
  return (
    <div className="list-tasks">
      <DataGrid data={tasks} />
    </div>
  );
};

export default ListTasks;
