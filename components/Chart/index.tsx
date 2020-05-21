import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';

type DataSet = {
    label: string;
    data: number[];
    borderColor?: string;
    fill?: boolean;
    lineTension?: number;
};

export type DataType = {
    labels: string[];
    datasets: DataSet[];
}

type PropTypes = {
    type?: 'line' | 'bar';
    chartData: DataType;
    options?: object;
};

const Chart = ({ type, chartData, options }: PropTypes) => {
    const [ data, setData ] = useState<DataType>();

    useEffect(() => {
        if (chartData) {
            setData(chartData);
        }
    }, [ chartData ]);

    if (!data) return null;
    
    return (
        <>
        {type === 'line'
        ? <Line data={data} options={{ ...options, elements: { point: { radius: 0 } } }} />
        : <Bar data={data} options={{ ...options }} />}
        </>
    );
};

export default Chart;
