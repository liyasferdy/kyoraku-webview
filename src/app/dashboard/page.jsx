"use client";

import { useEffect, useState } from "react";
import Charts from "./chart";

const STAT_COLORS = {
  "Total Count": {
    card: "bg-blue-100 border-blue-200",
    header: "bg-blue-200 text-blue-900",
    divider: "border-blue-200",
    text: "text-blue-800",
  },
  "Finish Good": {
    card: "bg-green-100 border-green-200",
    header: "bg-green-200 text-green-900",
    divider: "border-green-200",
    text: "text-green-800",
  },
  "NG Leak": {
    card: "bg-yellow-100 border-yellow-200",
    header: "bg-yellow-200 text-yellow-900",
    divider: "border-yellow-200",
    text: "text-yellow-800",
  },
  "NG Visual": {
    card: "bg-red-100 border-red-200",
    header: "bg-red-200 text-red-900",
    divider: "border-red-200",
    text: "text-red-800",
  },
};

const MACHINES = [
  { key: "AE060650-1780P", label: "AE060650-1780P" },
  { key: "AE060650-1551", label: "AE060650-1551" },
  { key: "AE060650-1780", label: "AE060650-1780" },
  { key: "MACHINE 4", label: "MACHINE 4" },
];

// Build stat rows for a given machine key from API summary
function buildStats(machine, summary) {
  const fg = summary?.finishGood?.byType?.[machine] ?? null;
  const ngLeak = summary?.ngLeak?.byType?.[machine] ?? null;
  const ngVisual = summary?.ngVisual?.byType?.[machine] ?? null;

  const total =
    fg !== null || ngLeak !== null || ngVisual !== null
      ? (fg ?? 0) + (ngLeak ?? 0) + (ngVisual ?? 0)
      : null;

  return [
    { label: "Total Count", value: total },
    { label: "Finish Good", value: fg },
    { label: "NG Leak", value: ngLeak },
    { label: "NG Visual", value: ngVisual },
  ];
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/machine");
        if (!res.ok) throw new Error("Failed to fetch summary data");
        const data = await res.json();

        console.log("[Dashboard] count data by machine:", {
          finishGood: data.summary.finishGood.byType,
          ngLeak: data.summary.ngLeak.byType,
          ngVisual: data.summary.ngVisual.byType,
        });

        setSummary(data.summary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-[calc(100vh-72px)] p-4 pt-40">
      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {MACHINES.map(({ key, label }) => {
          const stats = buildStats(key, summary);

          return (
            <div
              key={key}
              className="flex flex-col rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white"
            >
              {/* Header */}
              <h2 className="p-3 text-xl font-bold bg-rose-600 text-white tracking-wide">
                {label}
              </h2>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-2 p-3">
                {stats.map(({ label: statLabel, value }) => {
                  const colors = STAT_COLORS[statLabel];
                  return (
                    <div
                      key={`${key}-${statLabel}`}
                      className={`rounded-xl border overflow-hidden flex flex-col ${colors.card}`}
                    >
                      <div
                        className={`px-3 py-1.5 border-b text-xl text-center font-semibold uppercase tracking-wider ${colors.header} ${colors.divider}`}
                      >
                        {statLabel}
                      </div>
                      <div className="flex items-center justify-center py-4">
                        {loading ? (
                          <span
                            className={`text-3xl font-bold animate-pulse ${colors.text}`}
                          >
                            —
                          </span>
                        ) : (
                          <span
                            className={`text-3xl font-bold tabular-nums ${colors.text}`}
                          >
                            {value !== null ? value : "—"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="mx-3 border-t border-gray-100" />

              {/* Chart */}
              <div className="p-3 mt-10">
                <Charts data={stats} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
