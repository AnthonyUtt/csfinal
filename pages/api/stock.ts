import axios from 'axios';

const endpointUrl = 'https://www.alphavantage.co/query?';

export default async (req, res) => {
    const {
        query: { func, symbol },
        method,
    } = req;

    if (method !== 'GET') {
        res.status(400);
        res.end();
        return;
    }

    let response = await axios.get(endpointUrl, {
        params: {
            function: func,
            symbol,
            apikey: process.env.API_KEY,
        },
    });

    res.status(response.status);
    res.end(JSON.stringify(response.data));
};
