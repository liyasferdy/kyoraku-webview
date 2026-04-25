import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [[fgRows], [ngLeakRows], [ngVisualRows]] = await Promise.all([
      pool.query(
        `SELECT product_type, COUNT(*) AS count 
         FROM kbi_leak_test_mc_fg_raw 
         WHERE is_fg = 1 
         GROUP BY product_type`,
      ),
      pool.query(
        `SELECT product_type, COUNT(*) AS count 
         FROM kbi_leak_test_mc_ngleak_raw 
         WHERE is_ng_leak = 1 
         GROUP BY product_type`,
      ),
      pool.query(
        `SELECT product_type, COUNT(*) AS count 
         FROM kbi_leak_test_mc_ngvisual_raw 
         WHERE is_ng_visual = 1 
         GROUP BY product_type`,
      ),
    ]);

    // Helper: convert rows into { product_type: count } map
    const toMap = (rows) =>
      rows.reduce((acc, row) => {
        acc[row.product_type] = Number(row.count);
        return acc;
      }, {});

    // Helper: sum all counts in a map
    const sumMap = (map) => Object.values(map).reduce((a, b) => a + b, 0);

    const finishGoodByType = toMap(fgRows);
    const ngLeakByType = toMap(ngLeakRows);
    const ngVisualByType = toMap(ngVisualRows);

    const summary = {
      plan: 0, // placeholder — replace with real query when available
      finishGood: {
        total: sumMap(finishGoodByType),
        byType: finishGoodByType,
      },
      ngLeak: {
        total: sumMap(ngLeakByType),
        byType: ngLeakByType,
      },
      ngVisual: {
        total: sumMap(ngVisualByType),
        byType: ngVisualByType,
      },
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
