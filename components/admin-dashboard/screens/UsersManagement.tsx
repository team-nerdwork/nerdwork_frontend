"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminUsers,
  updateAdminUserStatus,
} from "@/actions/admin.actions";
import { ApiResult, AdminUser, Paginated } from "@/lib/types/admin";

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const pageSize = 20;

  useEffect(() => {
    const handle = setTimeout(() => {
      setQuery(searchTerm.trim());
    }, 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  const normalizedStatus = statusFilter === "all" ? undefined : statusFilter;

  const { data, isLoading, isError, refetch } = useQuery<
    ApiResult<Paginated<AdminUser>>
  >({
    queryKey: ["admin-users", query, statusFilter, page],
    queryFn: async () =>
      await getAdminUsers({
        query,
        status: normalizedStatus,
        page,
        pageSize,
      }),
  });

  const isFailed = data?.success === false;
  const users = data?.data?.data ?? [];
  const totalUsers = data?.data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));

  const getStatus = (user: AdminUser) => {
    const lockedUntil = user.lockedUntil ? new Date(user.lockedUntil) : null;
    const isLocked = lockedUntil && lockedUntil > new Date();
    if (isLocked) return "suspended";
    return user.isActive ? "active" : "inactive";
  };

  const getDisplayName = (user: AdminUser) => {
    if (user.displayName) return user.displayName;
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    if (fullName) return fullName;
    return user.username || user.email || "Unknown";
  };

  const activeCount = users.filter((user) => getStatus(user) === "active")
    .length;
  const suspendedCount = users.filter((user) => getStatus(user) === "suspended")
    .length;
  const inactiveCount = users.filter((user) => getStatus(user) === "inactive")
    .length;

  const handleStatusUpdate = async (
    userId: string,
    status: "active" | "suspended" | "inactive",
  ) => {
    setActionUserId(userId);
    const result = await updateAdminUserStatus(userId, { status });
    if (result?.success === false) {
      toast.error(result?.message || "Failed to update user status.");
    } else {
      toast.success("User status updated.");
      await refetch();
    }
    setActionUserId(null);
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
        <h1 className="text-3xl text-white mb-2">User Management</h1>
        <p className="text-red-500">Failed to load users.</p>
      </div>
    );
  }

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
            <p className="text-2xl text-white">{totalUsers.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Active Users</p>
            <p className="text-2xl text-white">{activeCount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Suspended</p>
            <p className="text-2xl text-white">
              {suspendedCount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Inactive</p>
            <p className="text-2xl text-white">
              {inactiveCount.toLocaleString()}
            </p>
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
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px] bg-[#1A1A24] border-[rgba(139,92,246,0.15)] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
              {users.map((user) => {
                const status = getStatus(user);
                const joined = user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-";
                const nftsOwned = user.nftsOwned ?? 0;
                const spent = user.spent ?? 0;

                return (
                  <TableRow
                    key={user.id}
                    className="border-[rgba(139,92,246,0.15)] hover:bg-[#1A1A24]"
                  >
                    <TableCell className="text-[#D1D5DB]">{user.id}</TableCell>
                    <TableCell className="text-white">
                      {getDisplayName(user)}
                    </TableCell>
                    <TableCell className="text-[#D1D5DB]">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          status === "active"
                            ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                            : status === "suspended"
                            ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                            : "bg-[#9CA3AF]/10 text-[#9CA3AF] border-[#9CA3AF]/20"
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#D1D5DB]">{joined}</TableCell>
                    <TableCell className="text-[#D1D5DB]">{nftsOwned}</TableCell>
                    <TableCell className="text-[#D1D5DB]">
                      ${Number(spent).toLocaleString()}
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
                          {status !== "suspended" && (
                            <DropdownMenuItem
                              className="text-[#D1D5DB] focus:bg-[#1A1A24] focus:text-white"
                              disabled={actionUserId === user.id}
                              onClick={() =>
                                handleStatusUpdate(user.id, "suspended")
                              }
                            >
                              <UserX size={16} className="mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          )}
                          {status !== "inactive" && (
                            <DropdownMenuItem
                              className="text-[#EF4444] focus:bg-[#EF4444]/10 focus:text-[#EF4444]"
                              disabled={actionUserId === user.id}
                              onClick={() =>
                                handleStatusUpdate(user.id, "inactive")
                              }
                            >
                              <Ban size={16} className="mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          )}
                          {status !== "active" && (
                            <DropdownMenuItem
                              className="text-[#10B981] focus:bg-[#10B981]/10 focus:text-[#10B981]"
                              disabled={actionUserId === user.id}
                              onClick={() =>
                                handleStatusUpdate(user.id, "active")
                              }
                            >
                              <UserCheck size={16} className="mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
