// Copyright Talkersoft LLC
// /frontend/storybook/src/stories/LineGraph/LineGraph.tsx

import React from 'react';
import {
    Line
} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './line-graph.scss';

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend
);

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
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const LineGraph: React.FC < LineGraphProps > = ({
    data,
    thresholdLabel,
    thresholdValue
}) => {
    const chartData = {
        labels: data.map(d => d.scheduled_time),
        datasets: [{
                label: 'Required Instances',
                data: data.map(d => d.required_instances),
                borderColor: '#8884d8',
                fill: false,
            },
            {
                label: thresholdLabel,
                data: data.map(() => thresholdValue),
                borderColor: 'red',
                borderDash: [5, 5],
                fill: false,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                },
                ticks: {
                    callback: (val: any, index: any) => {
                        if (data[index]) {
                            return formatXAxis(data[index].scheduled_time);
                        }
                        return '';
                    },
                },
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Required Instances',
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default LineGraph;
