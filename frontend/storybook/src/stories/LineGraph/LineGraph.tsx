/* Copyright Talkersoft LLC */
/* /frontend/storybook/src/stories/LineGraph/LineGraph.tsx */
// stories/LineGraph/LineGraph.tsx
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
} from 'recharts';
import './line-graph.scss';

interface DataPoint {
    scheduled_time: string;
    required_instances: number;
}

interface LineGraphProps {
    data: DataPoint[];
    thresholdLabel: string;
    thresholdValue: number;
}

const LineGraph: React.FC<LineGraphProps> = ({ data, thresholdLabel, thresholdValue }) => {
    return (
        <LineChart
            width={1000}
            height={600}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            className="line-graph"
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="scheduled_time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <ReferenceLine y={thresholdValue} label={thresholdLabel} stroke="red" />
            <Line type="monotone" dataKey="required_instances" stroke="#8884d8" />
        </LineChart>
    );
};

export default LineGraph;
