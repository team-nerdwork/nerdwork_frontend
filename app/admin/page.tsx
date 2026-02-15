import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminDashboard } from "@/components/admin-dashboard/AdminDashboard";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.adminToken) {
    redirect("/admin/signin");
  }

  return <AdminDashboard />;
}
