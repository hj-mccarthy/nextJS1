import { NextResponse } from "next/server"
import { getReports } from "@/lib/db"

export async function GET() {
  try {
    const reports = await getReports()
    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

