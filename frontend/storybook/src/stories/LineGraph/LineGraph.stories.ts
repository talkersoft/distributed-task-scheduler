// stories/LineGraph/LineGraph.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import LineGraph from './LineGraph';

const meta: Meta<typeof LineGraph> = {
    title: 'Components/LineGraph',
    component: LineGraph,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof LineGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = [
    { scheduled_time: '2024-06-29 00:00', required_instances: 5 },
    { scheduled_time: '2024-06-29 01:00', required_instances: 7 },
    { scheduled_time: '2024-06-29 02:00', required_instances: 3 },
    { scheduled_time: '2024-06-29 03:00', required_instances: 5 },
    // Add more data points for each hour
    { scheduled_time: '2024-06-29 23:00', required_instances: 8 },
    { scheduled_time: '2024-06-29 23:59', required_instances: 6 },
];

export const Default: Story = {
    args: {
        data: mockData,
        thresholdLabel: 'Scale-Up Threshold',
        thresholdValue: 5,
    },
};
