import React from 'react';
import { useTable, Column } from 'react-table';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import './data-grid.scss';

interface Task {
  name: string;
  task_type: string;
  cron_expression: string;
  message: string;
}

export const DataGrid: React.FC<{ data: Task[] }> = ({ data }) => {
  const columns = React.useMemo<Column<Task>[]>(
    () => [
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
        Header: 'Edit',
        Cell: () => <PencilSquareIcon className="edit-icon" />,
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <table {...getTableProps()} className="data-grid">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
