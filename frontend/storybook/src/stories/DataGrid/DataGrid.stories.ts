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
  {
    name: 'Task 10',
    task_type: 'reminder',
    cron_expression: '*/30 * * * *',
    message: 'Organize Files',
    next_runtime: "07-01-24 02:30 PM",
    time_zone: "America/New_York"
  },
  {
    name: 'Task 8',
    task_type: 'reminder',
    cron_expression: '*/5 * * * *',
    message: 'Make the bed',
    next_runtime: "07-01-24 02:30 PM",
    time_zone: "America/New_York"
  },
  {
    name: 'Task 7',
    task_type: 'reminder',
    cron_expression: '*/5 * * * *',
    message: 'Take out the trash',
    next_runtime: "07-01-24 02:30 PM",
    time_zone: "America/New_York"
  }
];

export const Default: Story = {
  args: {
    data: mockData,
  },
};
