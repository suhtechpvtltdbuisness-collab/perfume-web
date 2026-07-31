import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = { title: "Maison Control" };

export default function AdminPage() {
  return <AdminDashboard />;
}
