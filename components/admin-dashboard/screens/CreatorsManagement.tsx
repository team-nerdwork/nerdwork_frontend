"use client";

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
import { CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

const creators = [
  {
    id: "C001",
    name: "CryptoArtist",
    email: "crypto@example.com",
    status: "verified",
    works: 45,
    revenue: 45000,
    rating: 4.8,
  },
  {
    id: "C002",
    name: "DigitalDreamer",
    email: "dreamer@example.com",
    status: "pending",
    works: 12,
    revenue: 8500,
    rating: 4.5,
  },
  {
    id: "C003",
    name: "PixelMaster",
    email: "pixel@example.com",
    status: "verified",
    works: 38,
    revenue: 32000,
    rating: 4.9,
  },
];

export function CreatorsManagement() {
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
            <p className="text-2xl text-white">1,284</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Verified</p>
            <p className="text-2xl text-white">892</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Pending Review</p>
            <p className="text-2xl text-white">45</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Total Revenue</p>
            <p className="text-2xl text-white">$2.4M</p>
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
              {creators.map((creator) => (
                <TableRow
                  key={creator.id}
                  className="border-[rgba(139,92,246,0.15)] hover:bg-[#1A1A24]"
                >
                  <TableCell className="text-[#D1D5DB]">{creator.id}</TableCell>
                  <TableCell className="text-white">{creator.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        creator.status === "verified"
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                          : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                      }
                    >
                      <span className="flex items-center gap-1">
                        {creator.status === "verified" ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {creator.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#D1D5DB]">{creator.works}</TableCell>
                  <TableCell className="text-[#D1D5DB]">
                    ${creator.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-[#D1D5DB]">
                    Rating {creator.rating}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                      >
                        View
                      </Button>
                      {creator.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10"
                        >
                          Approve
                        </Button>
                      )}
                    </div>
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
