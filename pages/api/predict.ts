import MLR from 'ml-regression-multivariate-linear';

export default (req, res) => {
    if (req.body.data) {
        const {
            prices,
            series,
            next
        } = req.body.data;

        const mlr = new MLR(series, prices);

        let result = [];
        for (let i = 0; i < next.length; i++) {
            let val = mlr.predict(next[i]);

            for (let j = 0; j < val.length; j++) {
                // Adding basic 1D noise because otherwise
                // our predictions will just follow the trend line
                // and look inaccurate.
                let sign = (Math.random() * 2 - 1 < 0) ? -1 : 1;
                let noise = Math.random() / 100 * sign;  // Noise within 1%
                
                val[j] += val[j] * noise;
            }

            // Rechecking high and low bounds
            let min = Infinity;
            let max = -Infinity;
            for (let j = 0; j < val.length; j++) {
                if (val[j] > max) max = val[j];
                if (val[j] < min) min = val[j];
            }
            val[1] = max; // Setting high
            val[2] = min; // Setting low

            result.push(val);
        }
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    }
    else res.status(400).end();
};
