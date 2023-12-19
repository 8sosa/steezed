import React from 'react';
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

export default function BarChart() {
    const options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'Sales Metrics Comparison Chart',
        },
    },
    };

    const labels = ['Number of Customers', 'Average Order Value', 'Total Orders'];

    const data = {
    labels,
    datasets: [
        {
        label: 'Current Year',
        data: [962, 14, 1157],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
        label: 'Previous Year',
        data: [732, 12, 857],
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
  )
}