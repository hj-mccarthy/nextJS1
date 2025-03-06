import { NextResponse } from "next/server"
import { getMatchingEmployees } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { reportName: string } }) {
  try {
    const reportName = params.reportName
    if (!reportName) {
      return NextResponse.json({ error: "Report name is required" }, { status: 400 })
    }

    const employees = await getMatchingEmployees(reportName)
    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching matching employees:", error)
    return NextResponse.json({ error: "Failed to fetch matching employees" }, { status: 500 })
  }
}

