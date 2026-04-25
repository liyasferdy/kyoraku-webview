import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [[fgRows], [ngLeakRows], [ngVisualRows]] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) AS count FROM kbi_leak_test_mc_fg_raw WHERE is_fg = 1`,
      ),
      pool.query(
        `SELECT COUNT(*) AS count FROM kbi_leak_test_mc_ngleak_raw WHERE is_ng_leak = 1`,
      ),
      pool.query(
        `SELECT COUNT(*) AS count FROM kbi_leak_test_mc_ngvisual_raw WHERE is_ng_visual = 1`,
      ),
    ]);

    const summary = {
      plan: 0, // placeholder — replace with real query when available
      finishGood: Number(fgRows[0].count),
      ngLeak: Number(ngLeakRows[0].count),
      ngVisual: Number(ngVisualRows[0].count),
    };

    // Dummy NG Visual chart data (replace with real breakdown query later)
    const ngVisualChart = {
      labels: [
        "Thickness Welding NG Tebal",
        "Lelehan Undercut",
        "NG Nabrak",
        "Weld Line",
        "Zure / Step",
        "Bubble",
        "Hakka",
        "Gosong",
        "Ibutsu",
        "Burry Welding / Lelehan Tinggi",
        "Silver Mark",
        "Short Mold",
      ],
      values: [1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };

    return NextResponse.json({ summary, ngVisualChart });
  } catch (error) {
    console.error("[GET /api/summary] DB error:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary data" },
      { status: 500 },
    );
  }
}
