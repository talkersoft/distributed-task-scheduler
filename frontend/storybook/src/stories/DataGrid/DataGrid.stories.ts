import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataGrid } from './DataGrid';

const meta: Meta<typeof DataGrid> = {
  title: 'Components/Data Grid',
  component: DataGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = [
  { name: 'Task 10', task_type: 'reminder', cron_expression: '*/30 * * * *', message: 'Organize Files' },
  { name: 'Task 8', task_type: 'reminder', cron_expression: '*/5 * * * *', message: 'Make the bed' },
  { name: 'Task 7', task_type: 'reminder', cron_expression: '*/5 * * * *', message: 'Take out the trash' },
  { name: 'Task 6', task_type: 'reminder', cron_expression: '*/5 * * * *', message: 'Water the plants' },
  { name: 'Task 5', task_type: 'reminder', cron_expression: '*/5 * * * *', message: 'Feed the cat' },
  { name: 'Task 4', task_type: 'reminder', cron_expression: '*/5 * * * *', message: 'Walk the dog' },
  { name: 'Task 3', task_type: 'reminder', cron_expression: '*/5 * * * *', message: 'Book a flight' },
  { name: 'Task 1', task_type: 'reminder', cron_expression: '18 01 29 6 *', message: 'Build Software' },
  { name: 'Task 12', task_type: 'notification', cron_expression: '0 * * * *', message: 'Wash the dishes' },
  { name: 'Task 11', task_type: 'notification', cron_expression: '*/30 * * * *', message: 'Backup Data' },
  { name: 'Task 9', task_type: 'notification', cron_expression: '*/5 * * * *', message: 'Check mail' },
  { name: 'Task 2', task_type: 'notification', cron_expression: '*/1 * * * *', message: 'Update Software' },
  { name: 'Task 2', task_type: 'notification', cron_expression: '*/1 * * * *', message: 'Update Software' },
];

export const Default: Story = {
  args: {
    data: mockData,
  },
};
