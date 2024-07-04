/* Copyright Talkersoft LLC */
/* /frontend/storybook/src/stories/DataGrid/DataGrid.tsx */
import React from 'react';
import { useTable, Column } from 'react-table';
import './data-grid.scss';

interface DataGridProps<T extends object> {
  data: T[];
  columns: Column<T>[];
}

export const DataGrid = <T extends object>({ data, columns }: DataGridProps<T>) => {
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
        {headerGroups.map(headerGroup => {
          const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
          return (
            <tr key={key} {...headerGroupProps}>
              {headerGroup.headers.map(column => {
                const { key, ...columnProps } = column.getHeaderProps();
                return (
                  <th key={key} {...columnProps}>{column.render('Header')}</th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          const { key, ...rowProps } = row.getRowProps();
          return (
            <tr key={key} {...rowProps}>
              {row.cells.map(cell => {
                const { key, ...cellProps } = cell.getCellProps();
                return (
                  <td key={key} {...cellProps}>{cell.render('Cell')}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
