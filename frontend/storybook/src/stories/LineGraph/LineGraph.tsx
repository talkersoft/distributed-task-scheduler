// Copyright Talkersoft LLC
// /frontend/storybook/src/stories/LineGraph/LineGraph.tsx

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

const formatXAxis = (tickItem: string) => {
    return new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const LineGraph: React.FC<LineGraphProps> = ({ data, thresholdLabel, thresholdValue }) => {
    return (
        <LineChart
            width={1000}
            height={600}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            className="line-graph"
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="scheduled_time" tickFormatter={formatXAxis} stroke="#aaa" />
            <YAxis dataKey="required_instances" stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: "#333", borderColor: "#aaa" }} />
            <Legend />
            <ReferenceLine y={thresholdValue} label={thresholdLabel} stroke="red" />
            <Line type="monotone" dataKey="required_instances" stroke="#8884d8" />
        </LineChart>
    );
};

export default LineGraph;