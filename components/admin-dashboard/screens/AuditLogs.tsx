"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";

const auditLogs = [
  { id: "A001", action: "User Login", user: "admin@nerdwork.io", timestamp: "2024-01-15 10:23:45", status: "success" },
  { id: "A002", action: "Content Moderation", user: "mod@nerdwork.io", timestamp: "2024-01-15 10:15:22", status: "success" },
  { id: "A003", action: "Payout Processed", user: "admin@nerdwork.io", timestamp: "2024-01-15 09:45:12", status: "success" },
  { id: "A004", action: "Failed Login Attempt", user: "unknown@example.com", timestamp: "2024-01-15 09:32:08", status: "failed" },
  { id: "A005", action: "Creator Approved", user: "admin@nerdwork.io", timestamp: "2024-01-15 09:12:55", status: "success" },
];

export function AuditLogs() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Audit Logs</h1>
        <p className="text-[#9CA3AF]">Track all administrative actions and system events</p>
      </div>

      <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText size={20} />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[rgba(139,92,246,0.15)] hover:bg-transparent">
                <TableHead className="text-[#9CA3AF]">Log ID</TableHead>
                <TableHead className="text-[#9CA3AF]">Action</TableHead>
                <TableHead className="text-[#9CA3AF]">User</TableHead>
                <TableHead className="text-[#9CA3AF]">Timestamp</TableHead>
                <TableHead className="text-[#9CA3AF]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="border-[rgba(139,92,246,0.15)] hover:bg-[#1A1A24]">
                  <TableCell className="text-[#D1D5DB]">{log.id}</TableCell>
                  <TableCell className="text-white">{log.action}</TableCell>
                  <TableCell className="text-[#D1D5DB]">{log.user}</TableCell>
                  <TableCell className="text-[#D1D5DB]">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        log.status === "success"
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                          : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                      }
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
