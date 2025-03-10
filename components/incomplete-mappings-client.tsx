// /components/incomplete-mappings-client.tsx
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AddToReportDialog } from "@/components/add-to-report-dialog";
import type { Report, EmployeeWithMappings } from "@/lib/types";
import { Search } from "lucide-react";

interface IncompleteMappingsClientProps {
  employees: EmployeeWithMappings[];
  reports: Report[];
  getStatusBadge: (count: number) => JSX.Element;
}

export default function IncompleteMappingsClient({ employees, reports, getStatusBadge }: IncompleteMappingsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mappingCounts, setMappingCounts] = useState<Record<string, number>>(
    Object.fromEntries(employees.map((e) => [e.id, e.reportCount]))
  );

  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(searchLower) ||
      employee.id.toLowerCase().includes(searchLower) ||
      employee.teamName.toLowerCase().includes(searchLower) ||
      (employee.cityName + ", " + employee.countryName).toLowerCase().includes(searchLower)
    );
  });

  const handleMappingAdded = (employeeId: string, newCount: number) => {
    setMappingCounts((prev) => ({
      ...prev,
      [employeeId]: newCount,
    }));
  };

  return (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center border rounded-md px-3 py-2">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 p-0 shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Mappings</TableHead>
            <TableHead className="hidden md:table-cell">Team</TableHead>
            <TableHead className="hidden lg:table-cell">Location</TableHead>
            <TableHead className="hidden xl:table-cell">IDs</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">{employee.id}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(mappingCounts[employee.id])}</TableCell>
                <TableCell>
                  {employee.mappedReports ? (
                    <div className="max-w-[200px] truncate" title={employee.mappedReports}>
                      {employee.mappedReports}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">None</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div>
                    <div className="font-medium">{employee.teamName}</div>
                    <div className="text-sm text-muted-foreground">ID: {employee.teamId}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div>
                    <div>
                      {employee.cityName}, {employee.countryName}
                    </div>
                    <div className="text-sm text-muted-foreground">Area: {employee.areaId}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="space-y-1">
                    <Badge variant="outline" className="block w-fit">
                      City: {employee.cityId}
                    </Badge>
                    <Badge variant="outline" className="block w-fit">
                      Country: {employee.countryId}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <AddToReportDialog
                    employee={employee}
                    reports={reports}
                    onMappingAdded={(newCount) => handleMappingAdded(employee.id, newCount)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                {employees.length === 0 ? "No employees with incomplete mappings" : "No results found"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
