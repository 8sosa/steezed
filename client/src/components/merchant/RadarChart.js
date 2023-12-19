import React from 'react';
import Styles from './index.module.css'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function RadarChart() {
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
    {
      label: '# of Sales This Year',
      data: [150, 280, 160, 190, 220, 180, 150, 170, 90, 180, 150, 90],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

  return (
    <div className={Styles.lineBox}>
        <div className={Styles.rChart}>
            <Radar data={data} />
        </div>
    </div>
  )
}

export default RadarChart;