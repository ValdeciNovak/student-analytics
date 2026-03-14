"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, ChartBarIcon, ScrollTextIcon } from "lucide-react";
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
  {
    title: "Detalhes da Análise",
    url: "/detalhes-analise",
    icon: ScrollTextIcon,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t bg-sidebar px-4 gap-2">
      {items.map((item) => {
        const isActive = pathname === item.url;
        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-xs transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="size-5 shrink-0" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
