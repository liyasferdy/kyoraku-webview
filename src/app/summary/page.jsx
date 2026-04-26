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
import { useState, useRef, useEffect } from "react";
import { RangeCalendar } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

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
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState(null);
  const [tempRange, setTempRange] = useState(null); // selecting
  const wrapperRef = useRef(null);

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

  // close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToday = () => {
    const t = today(getLocalTimeZone());

    setTempRange({
      start: t,
      end: t,
    });
  };

  const handleApply = () => {
    setRange(tempRange);
    setOpen(false);
  };

  // Format Date
  const formatDate = (dateObj) => {
    if (!dateObj) return "Date";

    const jsDate = new Date(dateObj.year, dateObj.month - 1, dateObj.day);

    return jsDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // Label for Date picker
  const isSameDate = (a, b) => {
    if (!a || !b) return false;

    return a.year === b.year && a.month === b.month && a.day === b.day;
  };

  const label = range
    ? isSameDate(range.start, range.end)
      ? formatDate(range.start)
      : `${formatDate(range.start)} - ${formatDate(range.end)}`
    : tempRange
      ? "Selecting..."
      : formatDate(today(getLocalTimeZone()));

  // Charts configuration
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

      {/* Filter row */}
      <div className="relative" ref={wrapperRef}>
        {/* Date row */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="px-3 py-1 space-x-2 rounded text-sm font-semibold">
            <button
              onClick={() => setOpen(!open)}
              className="text-2xl border border-gray-300 rounded px-3 py-1 bg-white"
            >
              {label}
            </button>
          </div>
        </div>

        {/* Calendar Popup */}
        {open && (
          <div className="absolute mt-2 bg-white shadow-lg border rounded-xl z-9999 p-4">
            {/* Dynamic Button */}
            <div className="flex justify-end mb-2">
              {tempRange ? (
                <button
                  onClick={handleApply}
                  className="text-lg bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Apply
                </button>
              ) : (
                <button
                  onClick={handleToday}
                  className="text-lg bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600"
                >
                  Today
                </button>
              )}
            </div>

            <RangeCalendar
              aria-label="Select date range"
              firstDayOfWeek="mon"
              value={tempRange}
              onChange={setTempRange}
              classNames={{
                base: "p-4",
                header: "mb-2",
                title: "text-lg font-semibold",
                gridHeader: "text-sm",
                cell: "w-12 h-12 text-base", // 🔥 THIS controls size
              }}
            >
              <RangeCalendar.Header>
                <RangeCalendar.Heading />
                <RangeCalendar.NavButton slot="previous" />
                <RangeCalendar.NavButton slot="next" />
              </RangeCalendar.Header>

              <RangeCalendar.Grid>
                <RangeCalendar.GridHeader>
                  {(day) => (
                    <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                  )}
                </RangeCalendar.GridHeader>

                <RangeCalendar.GridBody>
                  {(date) => <RangeCalendar.Cell date={date} />}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
            </RangeCalendar>
          </div>
        )}
      </div>

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
