import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

type DataSet = {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
    lineTension: number;
};

export type DataType = {
    labels: string[];
    datasets: DataSet[];
}

type PropTypes = {
    chartData: DataType,
};

const Chart = ({ chartData }: PropTypes) => {
    const [ data, setData ] = useState<DataType>();

    useEffect(() => {
        if (chartData) {
            setData(chartData);
        }
    }, [ chartData ]);

    if (!data) return null;
    
    return (
        <Line data={data} options={{ elements: { point: { radius: 0 } } }} />
    );
};

export default Chart;
