import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark min-h-screen bg-[#0A0A0F] text-white">
      {children}
    </div>
  );
}
