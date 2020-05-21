import axios from 'axios';

export async function makePrediction(opens: number[], highs: number[], lows: number[], closes: number[], volume: number[], numPredictions: number) {
    let count = opens.length = highs.length = lows.length = closes.length = volume.length;
    let prices = [];
    let series = [];
    let next = [];

    for (let i = 0; i < count; i++) {
        prices.push([opens[i], highs[i], lows[i], closes[i], volume[i]]);
        series.push([i]);
    }
    
    for (let i = 0; i < numPredictions; i++) {
        next.push([count + i]);
    }

    let result = (await axios.post('api/predict', {
        data: {
            prices,
            series,
            next,
        },
    })).data;

    let newOpen = [];
    let newHigh = [];
    let newLow = [];
    let newClose = [];
    let newVolume = [];

    for (let i = 0; i < result.length; i++) {
        newOpen.push(result[i][0]);
        newHigh.push(result[i][1]);
        newLow.push(result[i][2]);
        newClose.push(result[i][3]);
        newVolume.push(result[i][4]);
    }

    console.log(result);

    return { newOpen, newHigh, newLow, newClose, newVolume };
}