import Head from 'next/head';
import axios from 'axios';

import styles from './styles.module.scss';

const dataset = [
    [73, 80, 75, 152],
    [93, 88, 93, 185],
    [89, 91, 90, 180],
    [96, 98, 100, 196],
    [73, 66, 70, 142],
    [53, 46, 55, 101],
    [69, 74, 77, 149],
    [47, 56, 60, 115],
    [87, 79, 90, 175],
    [79, 70, 88, 164],
    [69, 70, 73, 141],
    [70, 65, 74, 141],
    [93, 95, 91, 184],
    [79, 80, 73, 152],
    [70, 73, 78, 148],
    [93, 89, 96, 192],
    [78, 75, 68, 147],
    [81, 90, 93, 183],
    [88, 92, 86, 177],
    [78, 83, 77, 159],
    [82, 86, 90, 177],
    [86, 82, 89, 175],
    [78, 83, 85, 175],
    [76, 83, 71, 149],
    [96, 93, 95, 192]
];

const App = () => {
    const onClick = () => {
        let trainingSet = new Array(dataset.length);
        let predictions = new Array(dataset.length);

        for (let i = 0; i < dataset.length; i++) {
            trainingSet[i] = dataset[i].slice(0, 3);
            predictions[i] = dataset[i][3];
        }

        axios.post('api/predict', {
            data: {
                trainingSet,
                predictions,
                final: [trainingSet[trainingSet.length - 1]],
            },
        })
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    };

    const onClickToo = () => {
        axios.get('api/stock', {
            params: {
                func: 'TIME_SERIES_DAILY',
                symbol: 'MSFT',
            },
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    };

    return (
        <>
            <Head>
                <title>StockLogic</title>
            </Head>
            <p>App works!</p>
            <button onClick={onClickToo}>Click Me!</button>
        </>
    );
};

export default App;