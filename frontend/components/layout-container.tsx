"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { BottomNav } from "./bottom-nav";



function SidebarAutoClose() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile, setOpen } = useSidebar();
 
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  }, [pathname]);
 
  return null;
}


interface Props {
  children: React.ReactNode;
}

export function LayoutContainer({ children }: Props) {

  return (
    <div className="flex min-h-screen">
      <SidebarProvider defaultOpen={false}>
        <SidebarAutoClose />
        <AppSidebar className="hidden md:flex" />
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          {children}
        </main>
        <BottomNav />
      </SidebarProvider>
    </div>
  );
}
