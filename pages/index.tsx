import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';

import { Bar } from 'react-chartjs-2';
import Chart, { DataType as ChartDataType } from '../components/Chart';
import { makePrediction } from '../services/predictor';
import { calculateRSI, calculateSMA, calculateEMA } from '../services/indicators';

const App = () => {
    const [ chartData, setChartData ] = useState<ChartDataType>();
    const [ volumeData, setVolumeData ] = useState<ChartDataType>();
    const [ rsiData, setRsiData ] = useState<ChartDataType>();
    const [ maDataShown, setMaDataShown ] = useState(false);

    const onClick = () => {
        axios.get('api/stock', {
            params: {
                func: 'TIME_SERIES_DAILY',
                symbol: 'AMZN',
            },
        })
        .then((res) => {
            let meta = res.data['Meta Data'];
            let series = [];

            let raw = res.data['Time Series (Daily)'];
            for (let strProp in raw) {
                let entry = {
                    label: strProp,
                    open: Number(raw[strProp]['1. open']),
                    high: Number(raw[strProp]['2. high']),
                    low: Number(raw[strProp]['3. low']),
                    close: Number(raw[strProp]['4. close']),
                    volume: Number(raw[strProp]['5. volume']),
                };

                series.push(entry);
            }

            let volume: number[] = [];

            let data: ChartDataType = {
                labels: [],
                datasets: [
                    {
                        label: 'Open',
                        data: [],
                        borderColor: 'rgba(255,0,0,1)',
                        fill: false,
                        lineTension: 0,
                    },
                    {
                        label: 'High',
                        data: [],
                        borderColor: 'rgba(0,255,0,1)',
                        fill: false,
                        lineTension: 0,
                    },
                    {
                        label: 'Low',
                        data: [],
                        borderColor: 'rgba(0,0,255,1)',
                        fill: false,
                        lineTension: 0,
                    },
                    {
                        label: 'Close',
                        data: [],
                        borderColor: 'rgba(0,255,255,1)',
                        fill: false,
                        lineTension: 0,
                    },
                ],
            };

            series.forEach((entry) => {
                data.labels.push(entry.label);
                data.datasets[0].data.push(entry.open);
                data.datasets[1].data.push(entry.high);
                data.datasets[2].data.push(entry.low);
                data.datasets[3].data.push(entry.close);

                volume.push(entry.volume);
            });

            setChartData(data);

            setVolumeData({
                labels: data.labels,
                datasets: [{
                    label: 'Volume',
                    data: volume,
                    borderColor: 'rgba(0, 255, 0, 0.3)',
                    fill: true,
                    lineTension: 0,
                }],
            });
        })
        .catch((err) => console.log(err));
    };

    const addNewPrediction = () => {
        let opens = chartData.datasets[0].data;
        let highs = chartData.datasets[1].data;
        let lows = chartData.datasets[2].data;
        let closes = chartData.datasets[3].data;

        makePrediction(opens, highs, lows, closes, 5)
            .then((res) => {
                setChartData({
                    labels: chartData.labels.concat(['new1', 'new2', 'new3', 'new4', 'new5']),
                    datasets: [
                        {
                            label: 'Open',
                            data: opens.concat(res.newOpen),
                            borderColor: 'rgba(255,0,0,1)',
                            fill: false,
                            lineTension: 0,
                        },
                        {
                            label: 'High',
                            data: highs.concat(res.newHigh),
                            borderColor: 'rgba(0,255,0,1)',
                            fill: false,
                            lineTension: 0,
                        },
                        {
                            label: 'Low',
                            data: lows.concat(res.newLow),
                            borderColor: 'rgba(0,0,255,1)',
                            fill: false,
                            lineTension: 0,
                        },
                        {
                            label: 'Close',
                            data: closes.concat(res.newClose),
                            borderColor: 'rgba(0,255,255,1)',
                            fill: false,
                            lineTension: 0,
                        },
                    ],
                });
            })
            .catch((err) => console.error(err));
    };

    const printRSI = () => {
        let closes = chartData.datasets[3].data;
        let period = 14;

        let rsi = calculateRSI(period, closes);
        
        setRsiData({
            labels: chartData.labels,
            datasets: [{
                label: `${period.toString()}-Day RSI`,
                data: rsi,
                borderColor: 'rgba(255, 0, 255, 0.2)',
                fill: true,
                lineTension: 1,
            }]
        });
    };

    const printSMA = () => {
        if (maDataShown) return;

        let closes = chartData.datasets[3].data;
        let period = 14;

        let sma = calculateSMA(period, closes);
        let ema = calculateEMA(period, closes, sma[period]);

        setChartData(prevState => ({
            ...prevState,
            datasets: [
                ...prevState.datasets,
                {
                    label: `${period.toString()}-Day SMA`,
                    data: sma,
                    borderColor: 'rgba(255, 51, 204, 0.5)',
                    fill: false,
                    lineTension: 1,
                },
                {
                    label: `${period.toString()}-Day EMA`,
                    data: ema,
                    borderColor: 'rgba(255, 153, 51, 0.5)',
                    fill: false,
                    lineTension: 1,
                },
            ]
        }));
        setMaDataShown(true);
    };

    return (
        <>
            <Head>
                <title>StockLogic</title>
            </Head>
            <p>App works!</p>
            <button onClick={onClick}>Click Me!</button>
            <button onClick={printSMA}>SMA</button>
            {chartData && <Chart chartData={chartData} />}
            {volumeData && <Bar data={volumeData} />}
            <button onClick={addNewPrediction}>Add New Guess</button>
            <button onClick={printRSI}>RSI</button>
            {rsiData && <Chart chartData={rsiData} />}
        </>
    );
};

export default App;