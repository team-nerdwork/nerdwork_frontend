"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Ban,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
  {
    id: "U001",
    name: "Alex Rivera",
    email: "alex@example.com",
    status: "active",
    joined: "2024-01-15",
    nftsOwned: 12,
    spent: 4500,
  },
  {
    id: "U002",
    name: "Jordan Chen",
    email: "jordan@example.com",
    status: "active",
    joined: "2024-02-20",
    nftsOwned: 8,
    spent: 2300,
  },
  {
    id: "U003",
    name: "Sam Williams",
    email: "sam@example.com",
    status: "suspended",
    joined: "2023-11-05",
    nftsOwned: 5,
    spent: 1200,
  },
  {
    id: "U004",
    name: "Taylor Kim",
    email: "taylor@example.com",
    status: "active",
    joined: "2024-03-10",
    nftsOwned: 15,
    spent: 6800,
  },
  {
    id: "U005",
    name: "Morgan Davis",
    email: "morgan@example.com",
    status: "inactive",
    joined: "2023-09-22",
    nftsOwned: 3,
    spent: 890,
  },
];

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white mb-2">User Management</h1>
          <p className="text-[#9CA3AF]">Manage and monitor platform users</p>
        </div>
        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
          Export Users
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Total Users</p>
            <p className="text-2xl text-white">24,563</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Active Users</p>
            <p className="text-2xl text-white">18,492</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Suspended</p>
            <p className="text-2xl text-white">142</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">New (30d)</p>
            <p className="text-2xl text-white">1,847</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                size={20}
              />
              <Input
                placeholder="Search users by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1A1A24] border-[rgba(139,92,246,0.15)] text-white"
              />
            </div>
            <Button
              variant="outline"
              className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB] hover:bg-[#1A1A24]"
            >
              <Filter size={20} className="mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
        <CardHeader>
          <CardTitle className="text-white">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[rgba(139,92,246,0.15)] hover:bg-transparent">
                <TableHead className="text-[#9CA3AF]">User ID</TableHead>
                <TableHead className="text-[#9CA3AF]">Name</TableHead>
                <TableHead className="text-[#9CA3AF]">Email</TableHead>
                <TableHead className="text-[#9CA3AF]">Status</TableHead>
                <TableHead className="text-[#9CA3AF]">Joined</TableHead>
                <TableHead className="text-[#9CA3AF]">NFTs Owned</TableHead>
                <TableHead className="text-[#9CA3AF]">Total Spent</TableHead>
                <TableHead className="text-[#9CA3AF]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-[rgba(139,92,246,0.15)] hover:bg-[#1A1A24]"
                >
                  <TableCell className="text-[#D1D5DB]">{user.id}</TableCell>
                  <TableCell className="text-white">{user.name}</TableCell>
                  <TableCell className="text-[#D1D5DB]">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === "active"
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                          : user.status === "suspended"
                          ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                          : "bg-[#9CA3AF]/10 text-[#9CA3AF] border-[#9CA3AF]/20"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#D1D5DB]">{user.joined}</TableCell>
                  <TableCell className="text-[#D1D5DB]">{user.nftsOwned}</TableCell>
                  <TableCell className="text-[#D1D5DB]">
                    ${user.spent.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#D1D5DB] hover:bg-[#1A1A24]"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
                        <DropdownMenuItem className="text-[#D1D5DB] focus:bg-[#1A1A24] focus:text-white">
                          <UserCheck size={16} className="mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#D1D5DB] focus:bg-[#1A1A24] focus:text-white">
                          <Mail size={16} className="mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#D1D5DB] focus:bg-[#1A1A24] focus:text-white">
                          <UserX size={16} className="mr-2" />
                          Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#EF4444] focus:bg-[#EF4444]/10 focus:text-[#EF4444]">
                          <Ban size={16} className="mr-2" />
                          Ban User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
