import React from 'react';
import Styles from './index.module.css'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend )

function LineChart() {
    const options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'Past Sales by Year',
        },
    },
    };

    const labels = ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

    const data = {
    labels,
    datasets: [
        {
        label: 'Product 1',
        data: [10, 8, 6, 4, 2, 18, 35, 6, 8, 12, 15, 27],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
        label: 'Product 2',
        data: [15, 28, 16, 19, 22, 18, 15, 17, 9, 18, 5, 7],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
    };

    return (
        <div className={Styles.lineBox}>
            <div className={Styles.lChart}>
                <Line
                data={data}
                options={options}>
                </Line>
            </div>
        </div>
    )
}

export default LineChart;