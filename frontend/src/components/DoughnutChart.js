import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './../styles/DoughnutChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const data = {
    labels: ['Solar', 'Wind', 'Geothermal', 'Hydro'],
    datasets: [
      {
        data: [45, 25, 15, 15],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Energy Sources Breakdown',
      },
    },
  };

  return (
    <div className="doughnut-chart-container">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
