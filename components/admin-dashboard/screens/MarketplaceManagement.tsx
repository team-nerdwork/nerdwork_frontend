"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAdminOverview, getMarketplaceSummary } from "@/actions/admin.actions";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, DollarSign } from "lucide-react";

export function MarketplaceManagement() {
  const { data: summaryData, isLoading, isError } = useQuery({
    queryKey: ["admin-marketplace-summary"],
    queryFn: async () => await getMarketplaceSummary(),
  });

  const { data: overviewData } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => await getAdminOverview(),
  });

  const isFailed = summaryData?.success === false;
  const summary = summaryData?.data ?? {
    totalNftsMinted: 0,
    sales7d: 0,
    volume7d: 0,
  };
  const salesData = overviewData?.data?.charts?.nftSales ?? [];

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
        <h1 className="text-3xl text-white mb-2">Marketplace & NFT Sales</h1>
        <p className="text-red-500">Failed to load marketplace data.</p>
      </div>
    );
  }
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
                <p className="text-2xl text-white">{summary.totalNftsMinted.toLocaleString()}</p>
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
                <p className="text-2xl text-white">{summary.sales7d.toLocaleString()}</p>
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
                <p className="text-2xl text-white">${summary.volume7d.toLocaleString()}</p>
              </div>
              <DollarSign className="text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
        <CardHeader>
          <CardTitle className="text-white">Sales (Last 7 Days)</CardTitle>
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
              <Line type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
