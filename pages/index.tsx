import { useState } from 'react'
import Head from 'next/head'
import axios from 'axios'

import Chart, { DataType as ChartDataType } from '../components/Chart'
import { makePrediction } from '../services/predictor'
import {
    calculateRSI,
    calculateSMA,
    calculateEMA,
} from '../services/indicators'

const App = () => {
    const [stock, setStock] = useState('')
    const [chartData, setChartData] = useState<ChartDataType>()
    const [volumeData, setVolumeData] = useState<ChartDataType>()
    const [rsiData, setRsiData] = useState<ChartDataType>()

    const getStockData = (stock: string, period: number) => {
        axios
            .get('api/stock', {
                params: {
                    func: 'TIME_SERIES_DAILY',
                    symbol: stock,
                },
            })
            .then((res) => {
                let series = []

                let rawData = res.data['Time Series (Daily)']
                for (let strProp in rawData) {
                    let entry = {
                        label: strProp,
                        open: Number(rawData[strProp]['1. open']),
                        high: Number(rawData[strProp]['2. high']),
                        low: Number(rawData[strProp]['3. low']),
                        close: Number(rawData[strProp]['4. close']),
                        volume: Number(rawData[strProp]['5. volume']),
                    }

                    series.push(entry)
                }

                let volume: number[] = []

                let data: ChartDataType = {
                    labels: [],
                    datasets: [
                        {
                            label: 'Open',
                            data: [],
                            borderColor: 'rgba(255,0,0,0.5)',
                            fill: false,
                            lineTension: 0,
                        },
                        {
                            label: 'High',
                            data: [],
                            borderColor: 'rgba(0,255,0,0.5)',
                            fill: false,
                            lineTension: 0,
                        },
                        {
                            label: 'Low',
                            data: [],
                            borderColor: 'rgba(0,0,255,0.5)',
                            fill: false,
                            lineTension: 0,
                        },
                        {
                            label: 'Close',
                            data: [],
                            borderColor: 'rgba(0,255,255,0.5)',
                            fill: false,
                            lineTension: 0,
                        },
                    ],
                }

                series.forEach((entry) => {
                    data.labels.unshift(entry.label)
                    data.datasets[0].data.unshift(entry.open)
                    data.datasets[1].data.unshift(entry.high)
                    data.datasets[2].data.unshift(entry.low)
                    data.datasets[3].data.unshift(entry.close)

                    volume.unshift(entry.volume)
                })

                setChartData(data)

                setVolumeData({
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Volume',
                            data: volume,
                        },
                    ],
                })

                let closes = data.datasets[3].data

                let sma = calculateSMA(period, closes)
                let ema = calculateEMA(period, closes, sma[period])

                setChartData((prevState) => ({
                    labels: prevState.labels,
                    datasets: [
                        ...prevState.datasets.slice(0, 4),
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
                    ],
                }))

                let rsi = calculateRSI(period, closes)

                setRsiData({
                    labels: data.labels,
                    datasets: [
                        {
                            label: `${period.toString()}-Day RSI`,
                            data: rsi,
                            borderColor: 'rgba(255, 0, 255, 0.2)',
                            fill: false,
                            lineTension: 1,
                        },
                    ],
                })
            })
            .catch((err) => {
                //do stuff
                console.error(err)
            })
    }

    const addNewPrediction = (period: number) => {
        let opens = chartData.datasets[0].data
        let highs = chartData.datasets[1].data
        let lows = chartData.datasets[2].data
        let closes = chartData.datasets[3].data
        let volume = volumeData.datasets[0].data

        makePrediction(opens, highs, lows, closes, volume, 5)
            .then((res) => {
                setChartData({
                    labels: chartData.labels.concat([
                        'new1',
                        'new2',
                        'new3',
                        'new4',
                        'new5',
                    ]),
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
                })

                setVolumeData({
                    labels: volumeData.labels.concat([
                        'new1',
                        'new2',
                        'new3',
                        'new4',
                        'new5',
                    ]),
                    datasets: [{
                        label: 'Volume',
                        data: volume.concat(res.newVolume),
                    }]
                })

                let sma = calculateSMA(period, closes.concat(res.newClose))
                let ema = calculateEMA(period, closes.concat(res.newClose), sma[period])

                setChartData((prevState) => ({
                    labels: chartData.labels.concat([
                        'new1',
                        'new2',
                        'new3',
                        'new4',
                        'new5',
                    ]),
                    datasets: [
                        ...prevState.datasets.slice(0, 4),
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
                    ],
                }))

                let rsi = calculateRSI(period, closes.concat(res.newClose))

                setRsiData({
                    labels: chartData.labels.concat([
                        'new1',
                        'new2',
                        'new3',
                        'new4',
                        'new5',
                    ]),
                    datasets: [
                        {
                            label: `${period.toString()}-Day RSI`,
                            data: rsi,
                            borderColor: 'rgba(255, 0, 255, 0.2)',
                            fill: false,
                            lineTension: 1,
                        },
                    ],
                })
            })
            .catch((err) => console.error(err))
    }

    return (
        <>
            <Head>
                <title>StockLogic</title>
            </Head>
            <div className="container">
                <form
                    onSubmit={(e) => {
                        getStockData(stock, 14)
                        e.preventDefault()
                    }}
                >
                    <input
                        type="text"
                        id="stock"
                        name="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Enter Stock Symbol"
                    />
                    <input type="submit" style={{ display: 'none' }} />
                </form>
                {chartData && (
                    <button onClick={() => addNewPrediction(14)}>
                        Calculate Prediction
                    </button>
                )}
                {chartData && <Chart type="line" chartData={chartData} />}
                {volumeData && <Chart type="bar" chartData={volumeData} />}
                {rsiData && (
                    <Chart
                        type="line"
                        chartData={rsiData}
                        options={{
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                            suggestedMax: 100,
                                        },
                                    },
                                ],
                            },
                        }}
                    />
                )}
            </div>
        </>
    )
}

export default App
