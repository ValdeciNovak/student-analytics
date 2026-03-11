"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface Props {
  children: React.ReactNode;
}

export function LayoutContainer({ children }: Props) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/register";

  return (
    <div className="flex min-h-screen">
      <SidebarProvider defaultOpen={false}>
        {!hideSidebar && <AppSidebar className="hidden md:flex" />}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </SidebarProvider>
    </div>
  );
}
