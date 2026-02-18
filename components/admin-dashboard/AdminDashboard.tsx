"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AdminOverview } from "./screens/AdminOverview";
import { UsersManagement } from "./screens/UsersManagement";
import { CreatorsManagement } from "./screens/CreatorsManagement";
import { ComicsManagement } from "./screens/ComicsManagement";
import { MarketplaceManagement } from "./screens/MarketplaceManagement";
import { FinanceManagement } from "./screens/FinanceManagement";
import { AuditLogs } from "./screens/AuditLogs";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Store,
  DollarSign,
  FileText,
  Palette,
  Menu,
  X,
} from "lucide-react";

type AdminScreen =
  | "overview"
  | "users"
  | "creators"
  | "comics"
  | "marketplace"
  | "finance"
  | "audit";

export function AdminDashboard() {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session } = useSession();
  const adminName = session?.admin?.name || "Admin User";
  const adminEmail = session?.admin?.email || session?.user?.email || "";

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "creators", label: "Creators", icon: Palette },
    { id: "comics", label: "Comics & Content", icon: BookOpen },
    { id: "marketplace", label: "Marketplace & NFTs", icon: Store },
    { id: "finance", label: "Finance & Payouts", icon: DollarSign },
    { id: "audit", label: "Audit Logs", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0F]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#121218] border-r border-[rgba(139,92,246,0.15)] transition-all duration-300 flex flex-col`}
      >
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-[rgba(139,92,246,0.15)] flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6]" />
              <span className="font-bold text-lg text-white">Nerdwork+</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#1A1A24] rounded-lg text-[#D1D5DB]"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id as AdminScreen)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#8B5CF6] text-white"
                    : "text-[#D1D5DB] hover:bg-[#1A1A24]"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Admin Badge */}
        {sidebarOpen && (
          <div className="p-4 border-t border-[rgba(139,92,246,0.15)]">
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1A1A24] rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] flex items-center justify-center text-white text-sm">
                AD
              </div>
              <div>
                <p className="text-sm text-white">{adminName}</p>
                <p className="text-xs text-[#9CA3AF]">{adminEmail}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {currentScreen === "overview" && <AdminOverview />}
        {currentScreen === "users" && <UsersManagement />}
        {currentScreen === "creators" && <CreatorsManagement />}
        {currentScreen === "comics" && <ComicsManagement />}
        {currentScreen === "marketplace" && <MarketplaceManagement />}
        {currentScreen === "finance" && <FinanceManagement />}
        {currentScreen === "audit" && <AuditLogs />}
      </main>
    </div>
  );
}
