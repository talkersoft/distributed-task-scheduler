/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/components/TaskList.tsx */
import React from 'react';
import { Column, CellProps } from 'react-table';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DataGrid } from 'storybook/src/stories/DataGrid/DataGrid';
import './task-list.scss';

interface Task {
  id: string;
  name: string;
  task_type: string;
  cron_expression: string;
  message: string;
  next_runtime: string;
  time_zone: string;
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
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
      {
        Header: 'Delete',
        Cell: ({ row }: CellProps<Task>) => (
          <TrashIcon className="delete-icon" onClick={() => onDelete(row.original)} />
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <div className="list-tasks">
      <DataGrid data={tasks} columns={columns} />
    </div>
  );
};

export default TaskList;
