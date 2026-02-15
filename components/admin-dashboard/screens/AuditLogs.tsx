"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "@/actions/admin.actions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";

export function AuditLogs() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: async () => await getAuditLogs({ page: 1, pageSize: 20 }),
  });

  const isFailed = data?.success === false;
  const auditLogs = data?.data?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || isFailed) {
    return (
      <div className="p-8">
        <h1 className="text-3xl text-white mb-2">Audit Logs</h1>
        <p className="text-red-500">Failed to load audit logs.</p>
      </div>
    );
  }
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
              {auditLogs.map((log: any) => {
                const status = log.status || "unknown";
                const timestamp = log.createdAt
                  ? new Date(log.createdAt).toLocaleString()
                  : "-";
                const actor = log.metadata?.email || log.adminId || "-";
                return (
                  <TableRow
                    key={log.id}
                    className="border-[rgba(139,92,246,0.15)] hover:bg-[#1A1A24]"
                  >
                    <TableCell className="text-[#D1D5DB]">{log.id}</TableCell>
                    <TableCell className="text-white">{log.action}</TableCell>
                    <TableCell className="text-[#D1D5DB]">{actor}</TableCell>
                    <TableCell className="text-[#D1D5DB]">{timestamp}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          status === "success"
                            ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                            : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
