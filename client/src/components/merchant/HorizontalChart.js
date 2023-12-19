import React from 'react'
import Styles from './index.module.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function HorChart() { 
    const options = {
    indexAxis: 'y',
    elements: {
        bar: {
        borderWidth: 2,
        },
    },
    responsive: true,
    plugins: {
        legend: {
        position: 'right',
        },
        title: {
        display: true,
        text: 'Total Revenue Bar Chart',
        },
    },
    };

    const labels = ['Total Revenue'];

    const data = {
    labels,
    datasets: [
        {
        label: 'Current Year',
        data: [16580],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
        label: 'Previous Year',
        data: [10580],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
    };

  return (
    <div className={Styles.lineBox}>
        <div>
            <Bar options={options} data={data} />
        </div>
    </div>
  );
}
