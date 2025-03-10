// /components/report-dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportDetails from "@/components/report-details";
import EmployeeMappings from "@/components/employee-mappings";
import IncompleteMappings from "@/components/incomplete-mappings";
import { fetchMatchingEmployees } from "@/lib/data";
import type { Report, Employee, EmployeeWithMappings } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ReportDashboardProps {
  initialReports: Report[];
  initialIncompleteMappings: EmployeeWithMappings[];
}

export default function ReportDashboard({ initialReports, initialIncompleteMappings }: ReportDashboardProps) {
  const [reports] = useState<Report[]>(initialReports);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(initialReports[0] || null);
  const [filteredReports, setFilteredReports] = useState<Report[]>(initialReports);
  const [activeTab, setActiveTab] = useState<"reports" | "incomplete">("reports");

  useEffect(() => {
    if (selectedReport) {
      const loadEmployees = async () => {
        try {
          const matchedEmployees = await fetchMatchingEmployees(selectedReport.name);
          setEmployees(matchedEmployees);
        } catch (error) {
          console.error("Failed to load employees:", error);
        }
      };
      loadEmployees();
    }
  }, [selectedReport]);

  useEffect(() => {
    const newFilteredReports =
      selectedRegion === "all"
        ? reports
        : reports.filter((report) => report.region === selectedRegion);

    setFilteredReports(newFilteredReports);

    if (newFilteredReports.length > 0) {
      if (
        !selectedReport ||
        !newFilteredReports.some((report) => report.id === selectedReport.id)
      ) {
        setSelectedReport(newFilteredReports[0]);
      }
    } else {
      setSelectedReport(null);
    }
  }, [selectedRegion, reports]);

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
  };

  const handleReportChange = (value: string) => {
    const report = reports.find((r) => r.id === value);
    if (report) {
      setSelectedReport(report);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "reports" | "incomplete")} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="incomplete" asChild>
          <Link href="/dashboard/incomplete">
            Incomplete Mappings
            {initialIncompleteMappings.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                {initialIncompleteMappings.length}
              </Badge>
            )}
          </Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="reports" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Region</label>
            <Select value={selectedRegion} onValueChange={handleRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="AMER">AMER</SelectItem>
                <SelectItem value="EMEA">EMEA</SelectItem>
                <SelectItem value="APAC">APAC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Report</label>
            <Select
              value={selectedReport?.id}
              onValueChange={handleReportChange}
              disabled={filteredReports.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report" />
              </SelectTrigger>
              <SelectContent>
                {filteredReports.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedReport ? (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Report Details</TabsTrigger>
              <TabsTrigger value="mappings">Employee Mappings</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Report Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportDetails report={selectedReport} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="mappings">
              <Card>
                <CardHeader>
                  <CardTitle>Mapped Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmployeeMappings report={selectedReport} employees={employees} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                {filteredReports.length === 0
                  ? "No reports found for the selected region"
                  : "Select a report to view details"}
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="incomplete">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Employees with Incomplete Mappings</h2>
              <p className="text-sm text-muted-foreground">Showing employees mapped to fewer than 2 reports</p>
            </div>
            <Badge variant="secondary" className="text-base">
              Total: {initialIncompleteMappings.length}
            </Badge>
          </div>
          <IncompleteMappings employees={initialIncompleteMappings} reports={reports} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
