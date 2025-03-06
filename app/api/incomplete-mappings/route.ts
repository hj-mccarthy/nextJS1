import { NextResponse } from "next/server"
import { Database } from "sqlite3"
import { open } from "sqlite"

export async function GET() {
  try {
    const db = await open({
      filename: process.env.DATABASE_PATH || "./database.sqlite",
      driver: Database,
    })

    // Get employees with their mapping counts
    const employees = await db.all(`
      WITH mapping_counts AS (
        SELECT e.employee_id, COUNT(DISTINCT m.report_name) as report_count
        FROM employees e
        LEFT JOIN mappings m ON (
          (m.mapping_type = 'employee_id' AND m.mapping_id = e.employee_id) OR
          (m.mapping_type = 'team_id' AND m.mapping_id = e.team_id) OR
          (m.mapping_type = 'area_id' AND m.mapping_id = e.area_id) OR
          (m.mapping_type = 'city_id' AND m.mapping_id = e.city_id) OR
          (m.mapping_type = 'country_id' AND m.mapping_id = e.country_id)
        )
        WHERE m.inclusion_flag = 'Yes' OR m.inclusion_flag IS NULL
        GROUP BY e.employee_id
      )
      SELECT 
        e.*,
        COALESCE(mc.report_count, 0) as report_count,
        GROUP_CONCAT(DISTINCT r.report_name) as mapped_reports
      FROM employees e
      LEFT JOIN mapping_counts mc ON e.employee_id = mc.employee_id
      LEFT JOIN mappings m ON (
        (m.mapping_type = 'employee_id' AND m.mapping_id = e.employee_id) OR
        (m.mapping_type = 'team_id' AND m.mapping_id = e.team_id) OR
        (m.mapping_type = 'area_id' AND m.mapping_id = e.area_id) OR
        (m.mapping_type = 'city_id' AND m.mapping_id = e.city_id) OR
        (m.mapping_type = 'country_id' AND m.mapping_id = e.country_id)
      )
      LEFT JOIN reports r ON m.report_name = r.report_name AND m.inclusion_flag = 'Yes'
      WHERE mc.report_count < 2 OR mc.report_count IS NULL
      GROUP BY e.employee_id
      ORDER BY mc.report_count ASC, e.employee_name ASC
    `)

    await db.close()

    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching incomplete mappings:", error)
    return NextResponse.json({ error: "Failed to fetch incomplete mappings" }, { status: 500 })
  }
}

