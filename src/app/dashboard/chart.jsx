"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Inter } from "next/font/google";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const inter = Inter({ subsets: ["latin"] });

export default function Charts({ data }) {
  const getValue = (type) => {
    const stat = data.find((s) => s.label === type);
    return stat ? parseFloat(stat.value) : 0;
  };

  const finishGood = getValue("Finish Good");
  const ngVisual = getValue("NG Visual");
  const ngLeak = getValue("NG Leak");

  const chartData = {
    labels: ["Finish Good", "NG Visual", "NG Leak"],
    datasets: [
      {
        data: [finishGood, ngVisual, ngLeak],
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10, // bisa kamu adjust
          font: {
            family: inter.style.fontFamily,
          },
        },
      },
      x: {
        ticks: {
          font: {
            family: inter.style.fontFamily,
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="h-60">
      <Bar data={chartData} options={options} />
    </div>
  );
}
