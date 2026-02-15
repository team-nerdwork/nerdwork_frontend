"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, CreditCard, Clock } from "lucide-react";

const payouts = [
  { id: "P001", creator: "CryptoArtist", amount: 4500, status: "pending", date: "2024-01-15" },
  { id: "P002", creator: "PixelMaster", amount: 3200, status: "completed", date: "2024-01-14" },
  { id: "P003", creator: "NeonNinja", amount: 2800, status: "processing", date: "2024-01-13" },
];

export function FinanceManagement() {
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
                <p className="text-2xl text-white">$88,420</p>
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
                <p className="text-2xl text-white">$24,500</p>
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
                <p className="text-2xl text-white">$142,800</p>
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
                <p className="text-2xl text-white">12.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              {payouts.map((payout) => (
                <TableRow key={payout.id} className="border-[rgba(139,92,246,0.15)] hover:bg-[#1A1A24]">
                  <TableCell className="text-[#D1D5DB]">{payout.id}</TableCell>
                  <TableCell className="text-white">{payout.creator}</TableCell>
                  <TableCell className="text-[#D1D5DB]">${payout.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        payout.status === "completed"
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                          : payout.status === "processing"
                          ? "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20"
                          : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                      }
                    >
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#D1D5DB]">{payout.date}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]">
                      View Details
                    </Button>
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
