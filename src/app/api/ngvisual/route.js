import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET latest row joined with remarks
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.id,
        CONVERT_TZ(r.timestamp, '+00:00', '+07:00') AS timestamp,
        r.is_ng_visual,
        r.product_type,
        r.allcount_id,
        rm.id              AS remark_id,
        rm.ng_visual_remarks,
        rm.product_type    AS remark_product_type,
        rm.allcount_id     AS remark_allcount_id
      FROM kbi_leak_test_mc_ngvisual_raw r
      LEFT JOIN kbi_leak_test_mc_ngvisual_remarks rm
        ON r.id = rm.ngvisual_id
      ORDER BY r.timestamp DESC
      LIMIT 1
    `);

    return NextResponse.json(rows[0] || null);
  } catch (error) {
    console.error("DB ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT upsert remarks
export async function PUT(request) {
  try {
    const { ngvisual_id, ng_visual_remarks, product_type, allcount_id } =
      await request.json();

    if (!ngvisual_id || !ng_visual_remarks) {
      return NextResponse.json(
        { error: "ngvisual_id and ng_visual_remarks are required" },
        { status: 400 },
      );
    }

    const [result] = await pool.query(
      `
      INSERT INTO kbi_leak_test_mc_ngvisual_remarks
        (ngvisual_id, ng_visual_remarks, product_type, allcount_id)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        ng_visual_remarks = VALUES(ng_visual_remarks),
        product_type      = VALUES(product_type),
        allcount_id       = VALUES(allcount_id),
        updated_at        = CONVERT_TZ(NOW(), '+00:00', '+07:00')
      `,
      [
        ngvisual_id,
        ng_visual_remarks,
        product_type ?? null,
        allcount_id ?? null,
      ],
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
