"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, DollarSign } from "lucide-react";

const salesData = [
  { day: "Mon", sales: 12, volume: 4500 },
  { day: "Tue", sales: 19, volume: 7200 },
  { day: "Wed", sales: 15, volume: 5800 },
  { day: "Thu", sales: 22, volume: 8900 },
  { day: "Fri", sales: 28, volume: 11200 },
  { day: "Sat", sales: 35, volume: 14500 },
  { day: "Sun", sales: 31, volume: 12800 },
];

export function MarketplaceManagement() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Marketplace & NFT Sales</h1>
        <p className="text-[#9CA3AF]">Monitor NFT marketplace performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Total NFTs Minted</p>
                <p className="text-2xl text-white">45,284</p>
              </div>
              <Package className="text-[#8B5CF6]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Sales (7d)</p>
                <p className="text-2xl text-white">162</p>
              </div>
              <TrendingUp className="text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Volume (7d)</p>
                <p className="text-2xl text-white">$64.9K</p>
              </div>
              <DollarSign className="text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
        <CardHeader>
          <CardTitle className="text-white">Sales Volume (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
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
              <Line type="monotone" dataKey="volume" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
