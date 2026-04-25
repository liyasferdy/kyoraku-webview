"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const inter = Inter({ subsets: ["latin"] });

const STAT_STYLES = [
  {
    label: "Plan",
    key: "plan",
    card: "bg-yellow-100 border-yellow-300",
    header: "bg-yellow-300 text-yellow-900",
    text: "text-yellow-900",
  },
  {
    label: "Finish Good",
    key: "finishGood",
    card: "bg-green-500 border-green-600",
    header: "bg-green-600 text-white",
    text: "text-white",
  },
  {
    label: "NG Leak",
    key: "ngLeak",
    card: "bg-orange-300 border-orange-400",
    header: "bg-orange-400 text-white",
    text: "text-white",
  },
  {
    label: "NG Visual",
    key: "ngVisual",
    card: "bg-red-500 border-red-600",
    header: "bg-red-600 text-white",
    text: "text-white",
  },
];

export default function Summary({ onClose }) {
  const [summary, setSummary] = useState({
    plan: 0,
    finishGood: 0,
    ngLeak: 0,
    ngVisual: 0,
  });
  const [ngVisualChart, setNgVisualChart] = useState({
    labels: [],
    values: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/summary");
        if (!res.ok) throw new Error("Failed to fetch summary data");
        const data = await res.json();
        console.log("[Summary] count data:", {
          plan: data.summary.plan,
          finishGood: data.summary.finishGood,
          ngLeak: data.summary.ngLeak,
          ngVisual: data.summary.ngVisual,
        });
        setSummary(data.summary);
        setNgVisualChart(data.ngVisualChart);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const chartData = {
    labels: ngVisualChart.labels,
    datasets: [
      {
        data: ngVisualChart.values,
        backgroundColor: "#ef4444",
        borderRadius: 4,
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
          stepSize: 1,
          font: { family: inter.style.fontFamily },
        },
        grid: { color: "#f0f0f0" },
      },
      x: {
        ticks: {
          font: { family: inter.style.fontFamily, size: 12 },
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 w-450">
      {/* Title bar */}
      <div className="flex items-center justify-between bg-blue-600 px-6 py-3">
        <h2 className="text-white text-xl font-bold tracking-wide">
          Detail Summary Production
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded"
          >
            X
          </button>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-3 p-4">
        {STAT_STYLES.map(({ label, key, card, header, text }) => (
          <div
            key={label}
            className={`rounded-xl border overflow-hidden flex flex-col ${card}`}
          >
            <div
              className={`px-3 py-2 text-center text-lg font-bold uppercase ${header}`}
            >
              {label}
            </div>
            <div className="flex items-center justify-center py-5">
              {loading ? (
                <span className={`text-3xl font-bold animate-pulse ${text}`}>
                  —
                </span>
              ) : (
                <span className={`text-5xl font-bold tabular-nums ${text}`}>
                  {summary[key]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="px-4 pb-4">
        <div className="bg-blue-600 text-white font-semibold px-3 py-2 rounded-t-lg">
          Chart of NG Visual
        </div>
        <div className="border border-blue-200 rounded-b-lg p-4 bg-white h-100">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm animate-pulse">
              Loading chart...
            </div>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
}
