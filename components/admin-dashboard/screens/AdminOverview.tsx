"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const revenueData = [
  { month: "Jan", revenue: 45000, users: 1200 },
  { month: "Feb", revenue: 52000, users: 1450 },
  { month: "Mar", revenue: 48000, users: 1600 },
  { month: "Apr", revenue: 61000, users: 1850 },
  { month: "May", revenue: 75000, users: 2100 },
  { month: "Jun", revenue: 88000, users: 2450 },
];

const nftSalesData = [
  { day: "Mon", sales: 45 },
  { day: "Tue", sales: 62 },
  { day: "Wed", sales: 58 },
  { day: "Thu", sales: 71 },
  { day: "Fri", sales: 89 },
  { day: "Sat", sales: 102 },
  { day: "Sun", sales: 95 },
];

const topCreators = [
  { name: "CryptoArtist", revenue: 45000, nfts: 234 },
  { name: "DigitalDreamer", revenue: 38000, nfts: 189 },
  { name: "PixelMaster", revenue: 32000, nfts: 156 },
  { name: "NeonNinja", revenue: 28000, nfts: 142 },
  { name: "CosmicCreator", revenue: 24000, nfts: 128 },
];

export function AdminOverview() {
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
                <p className="text-3xl text-white">24,563</p>
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
                <p className="text-3xl text-white">1,284</p>
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
                <p className="text-3xl text-white">$88,420</p>
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
                <p className="text-3xl text-white">522</p>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-[#10B981]" />
                <span className="text-[#D1D5DB]">API Services</span>
              </div>
              <span className="text-xs text-[#10B981]">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-[#10B981]" />
                <span className="text-[#D1D5DB]">Database</span>
              </div>
              <span className="text-xs text-[#10B981]">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-[#10B981]" />
                <span className="text-[#D1D5DB]">Blockchain</span>
              </div>
              <span className="text-xs text-[#10B981]">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-[#F59E0B]" />
                <span className="text-[#D1D5DB]">IPFS Storage</span>
              </div>
              <span className="text-xs text-[#F59E0B]">Degraded</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-[#10B981]" />
                <span className="text-[#D1D5DB]">CDN</span>
              </div>
              <span className="text-xs text-[#10B981]">Operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
