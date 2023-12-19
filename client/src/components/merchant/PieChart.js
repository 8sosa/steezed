import React from 'react';
import Styles from './index.module.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'


ChartJS.register (ArcElement, Tooltip, Legend)


function PieChart() {
    const data = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
            label: 'Sales by Time Period',
            data: [10, 8, 6, 4, 2, 18, 5],
            backgroundColor: [
                '#012169',
                '#65000B',
                '#1B4D3E',
                '#E26310',
                '#FEBE10',
                '#DC82FF',
                '#FF69B4'
            ],
            borderColor: [
                'white',
                'white',
                'white',
                'white',
                'white',
                'white',
            ],
            borderWidth: 1,
            
            },
        ],
    }
    const options = {
        plugins: {
          legend: {
            position: 'right',
          },
          datalabels: {
            color: 'white',
            textAlign: 'center',
            anchor: 'start',
            formatter: (value, context) => {
              return `${context.chart.data.labels[context.dataIndex]}: ${value}%`;
            },
          },
          title: {
            display: true,
            text: 'Sales by Time Period',
            }
        },
      };
    return (
        <div className={Styles.chartBox}>
            <div className={Styles.dChart}>
                <Doughnut
                data={data}
                options={options}
                >
                </Doughnut>
            </div>
        </div>
    )
}

export default PieChart;