import type { Report, Employee } from "./types"

// Mock data for reports
const mockReports: Report[] = [
  {
    id: "report-1",
    name: "Q1 Sales Performance",
    region: "AMER",
    supervisors: ["emp-101", "emp-102"],
    mappings: [
      { type: "teamId", value: "team-sales" },
      { type: "countryId", value: "usa" },
    ],
  },
  {
    id: "report-2",
    name: "European Marketing Metrics",
    region: "EMEA",
    supervisors: ["emp-203"],
    mappings: [
      { type: "teamId", value: "team-marketing" },
      { type: "areaId", value: "area-europe" },
    ],
  },
  {
    id: "report-3",
    name: "APAC Customer Support",
    region: "APAC",
    supervisors: ["emp-304", "emp-305"],
    mappings: [
      { type: "teamId", value: "team-support" },
      { type: "areaId", value: "area-apac" },
    ],
  },
  {
    id: "report-4",
    name: "Global Executive Summary",
    region: "AMER",
    supervisors: ["emp-101", "emp-203", "emp-304"],
    mappings: [
      { type: "employeeId", value: "emp-101" },
      { type: "employeeId", value: "emp-203" },
      { type: "employeeId", value: "emp-304" },
      { type: "employeeId", value: "emp-401" },
    ],
  },
  {
    id: "report-5",
    name: "New York Office Performance",
    region: "AMER",
    supervisors: ["emp-102"],
    mappings: [{ type: "cityId", value: "nyc" }],
  },
  {
    id: "report-6",
    name: "London Team Analysis",
    region: "EMEA",
    supervisors: ["emp-203"],
    mappings: [{ type: "cityId", value: "london" }],
  },
  {
    id: "report-7",
    name: "Tokyo Office Metrics",
    region: "APAC",
    supervisors: ["emp-305"],
    mappings: [{ type: "cityId", value: "tokyo" }],
  },
]

// Mock data for employees
const mockEmployees: Employee[] = [
  {
    id: "emp-101",
    name: "John Smith",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-north-america",
    cityId: "nyc",
    countryId: "usa",
    location: "New York, USA",
  },
  {
    id: "emp-102",
    name: "Sarah Johnson",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-north-america",
    cityId: "sf",
    countryId: "usa",
    location: "San Francisco, USA",
  },
  {
    id: "emp-103",
    name: "Michael Brown",
    teamId: "team-marketing",
    teamName: "Marketing",
    areaId: "area-north-america",
    cityId: "nyc",
    countryId: "usa",
    location: "New York, USA",
  },
  {
    id: "emp-104",
    name: "Emily Davis",
    teamId: "team-support",
    teamName: "Customer Support",
    areaId: "area-north-america",
    cityId: "nyc",
    countryId: "usa",
    location: "New York, USA",
  },
  {
    id: "emp-201",
    name: "James Wilson",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-europe",
    cityId: "london",
    countryId: "uk",
    location: "London, UK",
  },
  {
    id: "emp-202",
    name: "Emma Taylor",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-europe",
    cityId: "paris",
    countryId: "france",
    location: "Paris, France",
  },
  {
    id: "emp-203",
    name: "Daniel Martinez",
    teamId: "team-marketing",
    teamName: "Marketing",
    areaId: "area-europe",
    cityId: "london",
    countryId: "uk",
    location: "London, UK",
  },
  {
    id: "emp-301",
    name: "Sophia Chen",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-apac",
    cityId: "tokyo",
    countryId: "japan",
    location: "Tokyo, Japan",
  },
  {
    id: "emp-302",
    name: "William Kim",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-apac",
    cityId: "singapore",
    countryId: "singapore",
    location: "Singapore",
  },
  {
    id: "emp-303",
    name: "Olivia Wang",
    teamId: "team-marketing",
    teamName: "Marketing",
    areaId: "area-apac",
    cityId: "sydney",
    countryId: "australia",
    location: "Sydney, Australia",
  },
  {
    id: "emp-304",
    name: "Ethan Tanaka",
    teamId: "team-support",
    teamName: "Customer Support",
    areaId: "area-apac",
    cityId: "tokyo",
    countryId: "japan",
    location: "Tokyo, Japan",
  },
  {
    id: "emp-305",
    name: "Ava Patel",
    teamId: "team-support",
    teamName: "Customer Support",
    areaId: "area-apac",
    cityId: "singapore",
    countryId: "singapore",
    location: "Singapore",
  },
  {
    id: "emp-401",
    name: "Noah Garcia",
    teamId: "team-executive",
    teamName: "Executive",
    areaId: "area-global",
    cityId: "nyc",
    countryId: "usa",
    location: "New York, USA",
  },
]

export interface EmployeeWithMappings extends Employee {
  missingFields?: string[]
}

// Fetch reports from the API
export async function fetchReports(): Promise<Report[]> {
  try {
    const response = await fetch("/api/reports")
    if (!response.ok) {
      throw new Error("Failed to fetch reports")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching reports:", error)
    return []
  }
}

// Fetch all employees from the API
export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch("/api/employees")
    if (!response.ok) {
      throw new Error("Failed to fetch employees")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching employees:", error)
    return []
  }
}

// Fetch employees that match a specific report
export async function fetchMatchingEmployees(reportName: string): Promise<Employee[]> {
  try {
    const encodedReportName = encodeURIComponent(reportName)
    const response = await fetch(`/api/reports/${encodedReportName}/employees`)
    if (!response.ok) {
      throw new Error("Failed to fetch matching employees")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching matching employees:", error)
    return []
  }
}

// Update the return type of fetchIncompleteMappings
export async function fetchIncompleteMappings(): Promise<EmployeeWithMappings[]> {
  try {
    const response = await fetch("/api/incomplete-mappings")
    if (!response.ok) {
      throw new Error("Failed to fetch incomplete mappings")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching incomplete mappings:", error)
    return []
  }
}

