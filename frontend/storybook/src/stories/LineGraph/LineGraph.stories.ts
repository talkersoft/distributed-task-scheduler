// Copyright Talkersoft LLC
// /frontend/storybook/src/stories/LineGraph/LineGraph.stories.ts

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
    { scheduled_time: '2024-06-29T00:00:00Z', required_instances: 5 },
    { scheduled_time: '2024-06-29T01:00:00Z', required_instances: 7 },
    { scheduled_time: '2024-06-29T02:00:00Z', required_instances: 3 },
    { scheduled_time: '2024-06-29T03:00:00Z', required_instances: 5 },
    { scheduled_time: '2024-06-29T23:00:00Z', required_instances: 8 },
    { scheduled_time: '2024-06-29T23:59:00Z', required_instances: 6 },
];

export const Default: Story = {
    args: {
        data: mockData,
        thresholdLabel: 'Scale-Up Threshold',
        thresholdValue: 5,
    },
};
