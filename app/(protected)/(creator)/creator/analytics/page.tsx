"use client";
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getCreatorAnalytics } from "@/actions/analytics.actions";

interface ChartDataPoint {
  date: string;
  count: number;
}

interface AnalyticsData {
  success: boolean;
  summary: {
    totalReads: number;
    activeReaders: number;
    totalLikes: number;
    totalRevenue: number;
    topComic: {
      id: string;
      title: string;
      reads: number;
    };
  };
  chart: {
    reads: ChartDataPoint[];
    likes: ChartDataPoint[];
    subscribers: ChartDataPoint[];
    revenue: ChartDataPoint[];
  };
}

const AnalyticsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["creator-analytics"],
    queryFn: async () => await getCreatorAnalytics(),
  });

  const analytics = data?.data as AnalyticsData;

  const { summary, chart } = analytics || {};

  const engagementHistory = useMemo(() => {
    if (!chart) return [];

    const dataMap = new Map<
      string,
      { reads: number; likes: number; subscribers: number; revenue: number }
    >();

    const processMetric = (
      data: ChartDataPoint[] | undefined,
      key: "reads" | "likes" | "subscribers" | "revenue",
    ) => {
      if (!data) return;
      data.forEach(({ date, count }) => {
        if (!dataMap.has(date)) {
          dataMap.set(date, { reads: 0, likes: 0, subscribers: 0, revenue: 0 });
        }
        const entry = dataMap.get(date)!;
        entry[key] = count;
      });
    };

    processMetric(chart.reads, "reads");
    processMetric(chart.likes, "likes");
    processMetric(chart.subscribers, "subscribers");
    processMetric(chart.revenue, "revenue");

    return Array.from(dataMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, values]) => ({
        name: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        ...values,
      }));
  }, [chart]);

  if (isLoading) {
    return (
      <main className="max-w-[1300px] mx-auto px-5 font-inter text-white pb-10 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="max-w-[1300px] mx-auto px-5 font-inter text-white pb-10">
        <div className="py-8">
          <h3 className="font-semibold text-[28px]">Analytics</h3>
          <p className="text-red-500">Failed to load analytics data.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1300px] mx-auto px-5 font-inter text-white pb-10">
      <div className="py-8">
        <h3 className="font-semibold text-[28px]">Analytics</h3>
        <p className="text-sm text-nerd-muted">
          Manage your tokens, earnings, and payouts
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={summary?.totalRevenue?.toLocaleString() || "0"}
            subtitle="Total earnings"
          />
          <StatCard
            title="Total Reads"
            value={summary?.totalReads?.toLocaleString() || "0"}
            subtitle="Across all comics"
          />
          <StatCard
            title="Total Likes"
            value={summary?.totalLikes?.toLocaleString() || "0"}
            subtitle="Across all comics"
          />
          <StatCard
            title="Top Comic"
            value={summary?.topComic?.title || "-"}
            subtitle={
              summary?.topComic
                ? `${summary.topComic.reads.toLocaleString()} reads`
                : "No data"
            }
          />
        </div>

        {/* Full Width Line Chart */}
        <ChartCard title="Engagement Overview">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={engagementHistory}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  borderColor: "#333",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="reads"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="likes" stroke="#82ca9d" />
              <Line type="monotone" dataKey="subscribers" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Two Small Area Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Revenue Over Time" className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#222",
                    borderColor: "#333",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Reads Over Time" className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#222",
                    borderColor: "#333",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="reads"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </main>
  );
};

const StatCard = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) => (
  <div className="bg-[#1d1e21] border border-[#29212e] rounded-xl p-5">
    <p className="text-nerd-muted text-sm font-medium">{title}</p>
    <h4 className="text-2xl font-bold mt-2">{value}</h4>
    <p className="text-nerd-muted text-sm font-medium">{subtitle}</p>
  </div>
);

const ChartCard = ({
  title,
  children,
  className = "h-[300px]",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="w-full bg-[#1d1e21] border border-[#29212e] rounded-xl p-6">
    <h4 className="font-semibold text-lg mb-6">{title}</h4>
    <div className={`w-full ${className}`}>{children}</div>
  </div>
);

export default AnalyticsPage;
