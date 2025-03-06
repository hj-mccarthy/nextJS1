"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Report, Employee } from "@/lib/types"
import { Search } from "lucide-react"

interface EmployeeMappingsProps {
  report: Report
  employees: Employee[]
}

export default function EmployeeMappings({ report, employees }: EmployeeMappingsProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      employee.name.toLowerCase().includes(searchLower) ||
      employee.id.toLowerCase().includes(searchLower) ||
      employee.teamName.toLowerCase().includes(searchLower) ||
      employee.location.toLowerCase().includes(searchLower)
    )
  })

  // Determine which mapping type matched for each employee
  const getMatchingCriteria = (employee: Employee) => {
    const matches = report.mappings
      .filter((mapping) => {
        switch (mapping.type) {
          case "employeeId":
            return mapping.value === employee.id
          case "teamId":
            return mapping.value === employee.teamId
          case "areaId":
            return mapping.value === employee.areaId
          case "cityId":
            return mapping.value === employee.cityId
          case "countryId":
            return mapping.value === employee.countryId
          default:
            return false
        }
      })
      .map((mapping) => mapping.type)

    return matches
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center border rounded-md px-3 py-2">
        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 p-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="hidden md:table-cell">Team</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Matched By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell className="hidden md:table-cell">{employee.teamName}</TableCell>
                  <TableCell className="hidden md:table-cell">{employee.location}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getMatchingCriteria(employee).map((criteria, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {criteria === "employeeId"
                            ? "Employee"
                            : criteria === "teamId"
                              ? "Team"
                              : criteria === "areaId"
                                ? "Area"
                                : criteria === "cityId"
                                  ? "City"
                                  : criteria === "countryId"
                                    ? "Country"
                                    : criteria}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {employees.length === 0 ? "No employees match the report criteria" : "No results found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredEmployees.length} of {employees.length} employees
      </div>
    </div>
  )
}

