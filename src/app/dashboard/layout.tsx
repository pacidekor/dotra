import type { Metadata } from "next";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const metadata: Metadata = {
  title: "Dashboard | Dotra",
  description: "Nastavení link tree profilu",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-dvh bg-background">
        <DashboardSidebar />
        <div className="lg:pl-64">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
