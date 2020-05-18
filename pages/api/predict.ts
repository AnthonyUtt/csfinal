import { RandomForestRegression as RFR } from 'ml-random-forest';

const options = {
    seed: 3,
    maxFeatures: 2,
    replacement: false,
    nEstimators: 200
};

export default (req, res) => {
    if (req.body.data) {
        const {
            trainingSet,
            predictions,
            final,
        } = req.body.data;

        let regression = new RFR(options);
        regression.train(trainingSet, predictions);
        let result = regression.predict(final);
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    }
    else res.status(400).end();
};
