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
    ReferenceLine as RechartsReferenceLine,
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

const XAxisComponent: React.FC<{
    dataKey?: string;
    tickFormatter?: (tickItem: string) => string;
    stroke?: string;
}> = ({ dataKey = 'scheduled_time', tickFormatter = formatXAxis, stroke = '#aaa', ...props }) => (
    <XAxis dataKey={dataKey} tickFormatter={tickFormatter} stroke={stroke} {...props} />
);

const YAxisComponent: React.FC<{
    dataKey?: string;
    stroke?: string;
}> = ({ dataKey = 'required_instances', stroke = '#aaa', ...props }) => (
    <YAxis dataKey={dataKey} stroke={stroke} {...props} />
);

const ReferenceLineComponent: React.FC<{
    y?: number;
    label?: string;
    stroke?: string;
}> = ({ y = 0, label = '', stroke = 'red', ...props }) => (
    <RechartsReferenceLine y={y} label={label} stroke={stroke} {...props} />
);

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
            <XAxisComponent />
            <YAxisComponent />
            <Tooltip contentStyle={{ backgroundColor: "#333", borderColor: "#aaa" }} />
            <Legend />
            <ReferenceLineComponent y={thresholdValue} label={thresholdLabel} />
            <Line type="monotone" dataKey="required_instances" stroke="#8884d8" />
        </LineChart>
    );
};

export default LineGraph;
