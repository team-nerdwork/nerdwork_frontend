"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAdminCreators, updateAdminCreatorVerification } from "@/actions/admin.actions";

export function CreatorsManagement() {
  const [actionCreatorId, setActionCreatorId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-creators"],
    queryFn: async () => await getAdminCreators({}),
  });

  const isFailed = data?.success === false;
  const creators = data?.data?.data ?? [];
  const totalCreators = data?.data?.pagination?.total ?? 0;
  const verifiedCount = creators.filter((creator: any) => creator.status === "verified").length;
  const pendingCount = creators.filter((creator: any) => creator.status === "pending").length;
  const totalRevenue = creators.reduce(
    (sum: number, creator: any) => sum + (creator.revenue ?? 0),
    0,
  );

  const handleVerification = async (creatorId: string, status: "verified" | "rejected") => {
    setActionCreatorId(creatorId);
    await updateAdminCreatorVerification(creatorId, { status });
    await refetch();
    setActionCreatorId(null);
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
        <h1 className="text-3xl text-white mb-2">Creator Management</h1>
        <p className="text-red-500">Failed to load creators.</p>
      </div>
    );
  }
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white mb-2">Creator Management</h1>
          <p className="text-[#9CA3AF]">Manage creators and verify applications</p>
        </div>
        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
          Review Applications
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Total Creators</p>
            <p className="text-2xl text-white">{totalCreators.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Verified</p>
            <p className="text-2xl text-white">{verifiedCount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Pending Review</p>
            <p className="text-2xl text-white">{pendingCount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Total Revenue</p>
            <p className="text-2xl text-white">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
        <CardHeader>
          <CardTitle className="text-white">All Creators</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[rgba(139,92,246,0.15)] hover:bg-transparent">
                <TableHead className="text-[#9CA3AF]">Creator ID</TableHead>
                <TableHead className="text-[#9CA3AF]">Name</TableHead>
                <TableHead className="text-[#9CA3AF]">Status</TableHead>
                <TableHead className="text-[#9CA3AF]">Works</TableHead>
                <TableHead className="text-[#9CA3AF]">Revenue</TableHead>
                <TableHead className="text-[#9CA3AF]">Rating</TableHead>
                <TableHead className="text-[#9CA3AF]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creators.map((creator: any) => {
                const status = creator.status || "pending";
                const isVerified = status === "verified";
                const isRejected = status === "rejected";
                const statusClasses = isVerified
                  ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                  : isRejected
                  ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                  : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";

                return (
                  <TableRow
                    key={creator.id}
                    className="border-[rgba(139,92,246,0.15)] hover:bg-[#1A1A24]"
                  >
                    <TableCell className="text-[#D1D5DB]">
                      {creator.id}
                    </TableCell>
                    <TableCell className="text-white">{creator.name}</TableCell>
                    <TableCell>
                      <Badge className={statusClasses}>
                        <span className="flex items-center gap-1">
                          {isVerified ? (
                            <CheckCircle size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#D1D5DB]">
                      {creator.works ?? 0}
                    </TableCell>
                    <TableCell className="text-[#D1D5DB]">
                      ${Number(creator.revenue ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-[#D1D5DB]">
                      {creator.rating ? `Rating ${creator.rating}` : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                        >
                          View
                        </Button>
                        {status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10"
                            disabled={actionCreatorId === creator.id}
                            onClick={() =>
                              handleVerification(creator.id, "verified")
                            }
                          >
                            Approve
                          </Button>
                        )}
                      </div>
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
