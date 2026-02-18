"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAdminPayouts, getFinanceSummary, processAdminPayout } from "@/actions/admin.actions";
import { ApiResult, AdminPayout, FinanceSummary, Paginated } from "@/lib/types/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, CreditCard, Clock } from "lucide-react";
import { toast } from "sonner";

export function FinanceManagement() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const { data: summaryData, isLoading, isError } = useQuery<ApiResult<FinanceSummary>>({
    queryKey: ["admin-finance-summary"],
    queryFn: async () => await getFinanceSummary(),
  });

  const { data: payoutsData, refetch: refetchPayouts } = useQuery<
    ApiResult<Paginated<AdminPayout>>
  >({
    queryKey: ["admin-payouts", statusFilter, page],
    queryFn: async () =>
      await getAdminPayouts({
        status: statusFilter === "all" ? undefined : statusFilter,
        page,
        pageSize,
      }),
  });

  const isFailed = summaryData?.success === false;
  const summary = summaryData?.data ?? {
    platformRevenue: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
    platformFeePercent: 0,
  };
  const payouts = payoutsData?.data?.data ?? [];
  const totalPayouts = payoutsData?.data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalPayouts / pageSize));

  const handleProcess = async (payoutId: string) => {
    const result = await processAdminPayout(payoutId, { status: "completed" });
    if (result?.success === false) {
      toast.error(result?.message || "Failed to process payout.");
    } else {
      toast.success("Payout processed.");
      await refetchPayouts();
    }
  };

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
        <h1 className="text-3xl text-white mb-2">Finance & Payouts</h1>
        <p className="text-red-500">Failed to load finance data.</p>
      </div>
    );
  }
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Finance & Payouts</h1>
        <p className="text-[#9CA3AF]">Manage payments and platform revenue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Platform Revenue</p>
                <p className="text-2xl text-white">${summary.platformRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Pending Payouts</p>
                <p className="text-2xl text-white">${summary.pendingPayouts.toLocaleString()}</p>
              </div>
              <Clock className="text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Completed Payouts</p>
                <p className="text-2xl text-white">${summary.completedPayouts.toLocaleString()}</p>
              </div>
              <CreditCard className="text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Platform Fee</p>
                <p className="text-2xl text-white">{summary.platformFeePercent}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[200px] bg-[#1A1A24] border-[rgba(139,92,246,0.15)] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
        <CardHeader>
          <CardTitle className="text-white">Recent Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[rgba(139,92,246,0.15)] hover:bg-transparent">
                <TableHead className="text-[#9CA3AF]">Payout ID</TableHead>
                <TableHead className="text-[#9CA3AF]">Creator</TableHead>
                <TableHead className="text-[#9CA3AF]">Amount</TableHead>
                <TableHead className="text-[#9CA3AF]">Status</TableHead>
                <TableHead className="text-[#9CA3AF]">Date</TableHead>
                <TableHead className="text-[#9CA3AF]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => {
                const status = payout.status || "pending";
                const date = payout.date
                  ? new Date(payout.date).toLocaleDateString()
                  : "-";
                return (
                  <TableRow
                    key={payout.id}
                    className="border-[rgba(139,92,246,0.15)] hover:bg-[#1A1A24]"
                  >
                    <TableCell className="text-[#D1D5DB]">{payout.id}</TableCell>
                    <TableCell className="text-white">
                      {payout.creator || "Unknown"}
                    </TableCell>
                    <TableCell className="text-[#D1D5DB]">
                      ${Number(payout.amount ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          status === "completed"
                            ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                            : status === "processing"
                            ? "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20"
                            : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#D1D5DB]">{date}</TableCell>
                    <TableCell>
                      {status === "pending" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                          onClick={() => handleProcess(payout.id)}
                        >
                          Process
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                        >
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-[#9CA3AF]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
