// /components/incomplete-mappings.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Report, EmployeeWithMappings } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import IncompleteMappingsClient from "./incomplete-mappings-client";

interface IncompleteMappingsProps {
  employees: EmployeeWithMappings[];
  reports: Report[];
}

export default function IncompleteMappings({ employees, reports }: IncompleteMappingsProps) {
  const getStatusBadge = (count: number) => {
    if (count === 0) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          No Mappings
        </Badge>
      );
    }
    return (
      <Badge variant="warning" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        1 Mapping
      </Badge>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <IncompleteMappingsClient employees={employees} reports={reports} getStatusBadge={getStatusBadge} />
      </CardContent>
    </Card>
  );
}
