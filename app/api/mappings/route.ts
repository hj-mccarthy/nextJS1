import { NextResponse } from "next/server"
import { Database } from "sqlite3"
import { open } from "sqlite"

export async function POST(request: Request) {
  try {
    const { employeeId, reportName, mappingType } = await request.json()

    if (!employeeId || !reportName || !mappingType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await open({
      filename: process.env.DATABASE_PATH || "./database.sqlite",
      driver: Database,
    })

    // Get the mapping ID based on the mapping type and employee
    const employee = await db.get(`SELECT * FROM employees WHERE employee_id = ?`, [employeeId])

    if (!employee) {
      await db.close()
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    let mappingId
    switch (mappingType) {
      case "employee_id":
        mappingId = employee.employee_id
        break
      case "team_id":
        mappingId = employee.team_id
        break
      case "area_id":
        mappingId = employee.area_id
        break
      case "city_id":
        mappingId = employee.city_id
        break
      case "country_id":
        mappingId = employee.country_id
        break
      default:
        await db.close()
        return NextResponse.json({ error: "Invalid mapping type" }, { status: 400 })
    }

    // Check if mapping already exists
    const existingMapping = await db.get(
      `SELECT * FROM mappings 
       WHERE report_name = ? AND mapping_type = ? AND mapping_id = ?`,
      [reportName, mappingType, mappingId],
    )

    if (existingMapping) {
      // Update existing mapping if it exists
      await db.run(
        `UPDATE mappings 
         SET inclusion_flag = 'Yes'
         WHERE report_name = ? AND mapping_type = ? AND mapping_id = ?`,
        [reportName, mappingType, mappingId],
      )
    } else {
      // Insert new mapping if it doesn't exist
      await db.run(
        `INSERT INTO mappings (report_name, mapping_type, mapping_id, inclusion_flag)
         VALUES (?, ?, ?, 'Yes')`,
        [reportName, mappingType, mappingId],
      )
    }

    // Get updated mapping count for the employee
    const { report_count } = await db.get(
      `SELECT COUNT(DISTINCT m.report_name) as report_count
       FROM mappings m
       WHERE m.mapping_id IN (?, ?, ?, ?, ?)
       AND m.inclusion_flag = 'Yes'
       AND m.mapping_type IN ('employee_id', 'team_id', 'area_id', 'city_id', 'country_id')`,
      [employee.employee_id, employee.team_id, employee.area_id, employee.city_id, employee.country_id],
    )

    await db.close()

    return NextResponse.json({
      success: true,
      reportCount: report_count,
      message: "Mapping added successfully",
    })
  } catch (error) {
    console.error("Error adding mapping:", error)
    return NextResponse.json({ error: "Failed to add mapping" }, { status: 500 })
  }
}

