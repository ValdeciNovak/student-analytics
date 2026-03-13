"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, ChartBarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Saúde",
    url: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Ação",
    url: "/acao-universitaria",
    icon: ChartBarIcon,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t bg-sidebar md:hidden">
      {items.map((item) => {
        const isActive = pathname === item.url;
        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors",
              isActive
                ? "text-sidebar-accent-foreground"
                : "text-muted-foreground hover:text-sidebar-foreground",
            )}
          >
            <item.icon
              className={cn(
                "size-5",
                isActive && "text-sidebar-accent-foreground",
              )}
            />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
