/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/components/ListTasks.tsx */
// src/components/ListTasks.tsx
import React from 'react';
import { useTable, Column, CellProps } from 'react-table';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { DataGrid } from 'storybook/src/stories/DataGrid/DataGrid';
import './list-tasks.scss';

interface Task {
  id: string;
  name: string;
  task_type: string;
  cron_expression: string;
  message: string;
  next_runtime: string;
  time_zone: string;
}

interface ListTasksProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

const ListTasks: React.FC<ListTasksProps> = ({ tasks, onEdit }) => {
  const columns: Column<Task>[] = React.useMemo(
    () => [
      {
        Header: 'Edit',
        Cell: ({ row }: CellProps<Task>) => (
          <PencilSquareIcon className="edit-icon" onClick={() => onEdit(row.original)} />
        ),
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Task Type',
        accessor: 'task_type',
      },
      {
        Header: 'Cron Expression',
        accessor: 'cron_expression',
      },
      {
        Header: 'Message',
        accessor: 'message',
      },
      {
        Header: 'Next Run',
        accessor: 'next_runtime',
      },
      {
        Header: 'Time Zone',
        accessor: 'time_zone',
      },
    ],
    [onEdit]
  );

  return (
    <div className="list-tasks">
      <DataGrid data={tasks} columns={columns} onEdit={onEdit} />
    </div>
  );
};

export default ListTasks;
