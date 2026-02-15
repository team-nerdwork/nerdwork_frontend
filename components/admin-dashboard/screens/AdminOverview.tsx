"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAdminOverview } from "@/actions/admin.actions";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export function AdminOverview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => await getAdminOverview(),
  });

  const isFailed = data?.success === false;
  const overview = data?.data;
  const summary = overview?.summary ?? {
    totalUsers: 0,
    totalCreators: 0,
    monthlyRevenue: 0,
    nftSales7d: 0,
  };
  const revenueData = overview?.charts?.revenueAndUsers ?? [];
  const nftSalesData = overview?.charts?.nftSales ?? [];
  const topCreators = overview?.topCreators ?? [];
  const systemStatus = overview?.systemStatus ?? [];

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
        <h1 className="text-3xl text-white mb-2">Admin Dashboard</h1>
        <p className="text-red-500">Failed to load admin overview.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-white mb-2">Admin Dashboard</h1>
        <p className="text-[#9CA3AF]">
          Welcome back! Here is what is happening with Nerdwork+ today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Total Users</p>
                <p className="text-3xl text-white">
                  {summary.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={14} className="text-[#10B981]" />
                  <span className="text-xs text-[#10B981]">+12.5%</span>
                  <span className="text-xs text-[#9CA3AF]">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                <Users className="text-[#8B5CF6]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Total Creators</p>
                <p className="text-3xl text-white">
                  {summary.totalCreators.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={14} className="text-[#10B981]" />
                  <span className="text-xs text-[#10B981]">+8.3%</span>
                  <span className="text-xs text-[#9CA3AF]">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#EC4899]/10 flex items-center justify-center">
                <BookOpen className="text-[#EC4899]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Monthly Revenue</p>
                <p className="text-3xl text-white">
                  ${summary.monthlyRevenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={14} className="text-[#10B981]" />
                  <span className="text-xs text-[#10B981]">+17.2%</span>
                  <span className="text-xs text-[#9CA3AF]">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                <DollarSign className="text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">NFT Sales (7d)</p>
                <p className="text-3xl text-white">
                  {summary.nftSales7d.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={14} className="text-[#10B981]" />
                  <span className="text-xs text-[#10B981]">+23.1%</span>
                  <span className="text-xs text-[#9CA3AF]">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                <TrendingUp className="text-[#3B82F6]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardHeader>
            <CardTitle className="text-white">Revenue & User Growth</CardTitle>
            <p className="text-sm text-[#9CA3AF]">Last 6 months performance</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121218",
                    border: "1px solid rgba(139,92,246,0.15)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* NFT Sales Chart */}
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardHeader>
            <CardTitle className="text-white">NFT Sales (Last 7 Days)</CardTitle>
            <p className="text-sm text-[#9CA3AF]">Daily transaction volume</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nftSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121218",
                    border: "1px solid rgba(139,92,246,0.15)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sales" fill="#EC4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Creators */}
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)] lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Creators</CardTitle>
            <p className="text-sm text-[#9CA3AF]">Ranked by revenue (this month)</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCreators.map((creator, index) => (
                <div
                  key={creator.name}
                  className="flex items-center justify-between p-4 bg-[#1A1A24] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-white">{creator.name}</p>
                      <p className="text-sm text-[#9CA3AF]">{creator.nfts} NFTs sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white">${creator.revenue.toLocaleString()}</p>
                    <p className="text-sm text-[#10B981]">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
            <p className="text-sm text-[#9CA3AF]">Platform health</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemStatus.map((service: any) => {
              const status = String(service.status || "").toLowerCase();
              const isOperational = status === "operational";
              const isDegraded = status === "degraded";
              const Icon = isOperational ? CheckCircle : AlertCircle;
              const color = isOperational
                ? "text-[#10B981]"
                : isDegraded
                ? "text-[#F59E0B]"
                : "text-[#EF4444]";
              const label =
                status.charAt(0).toUpperCase() + status.slice(1) || "Unknown";

              return (
                <div
                  key={service.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={20} className={color} />
                    <span className="text-[#D1D5DB]">{service.name}</span>
                  </div>
                  <span className={`text-xs ${color}`}>{label}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
