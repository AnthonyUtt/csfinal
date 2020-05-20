export function calculateRSI(period: number, closes: number[]) {
    let result = [null];

    let rollingWindow = [];
    let upValue = 0;
    let downValue = 0;

    for (let i = 1; i < closes.length; i++) {
        if (rollingWindow.length >= period) {
            let old = rollingWindow.shift();
            if (old > 0) {
                upValue -= old;
            } else if (old < 0) {
                downValue -= -old;
            }
        }

        let change = closes[i] - closes[i - 1];
        if (change > 0) {
            upValue += change;
        } else if (change < 0) {
            downValue += -change;
        }
        rollingWindow.push(change);

        if (rollingWindow.length < period) {
            result.push(null);
            continue;
        }

        let avgUp = upValue / period;
        let avgDown = downValue / period;

        let relativeStrength = avgUp / avgDown;

        let rsi = 100 - (100/(1 + relativeStrength));
        
        result.push(rsi);
    }
    return result;
}

export function calculateSMA(period: number, closes: number[]) {
    let result = [];
    
    for (let i = 0; i < closes.length; i++) {
        if (i < period) {
            result.push(null);
            continue;
        }

        let priceSum = 0;
        for (let j = 0; j < period; j++) {
            priceSum += closes[i - j];
        }

        let avg = priceSum / period;
        result.push(avg);
    }
    return result;
}

export function calculateEMA(period: number, closes: number[], initialSMA: number) {
    let result = [];
    let prevEMA = initialSMA;
    
    for (let i = 0; i < closes.length; i++) {
        if (i < period + 1) {
            result.push(null);
            continue;
        }

        let multiplier = 2 / (period + 1);
        let price = closes[i];

        let ema = (price * multiplier) + (prevEMA * (1 - multiplier));
        prevEMA = ema;
        result.push(ema);
    }
    return result;
}