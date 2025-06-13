"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Database, LineChart, MessageSquare, BarChart3, Gauge, Users } from "lucide-react"

export default function SideNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Executive Report",
      href: "/",
      icon: Gauge,
    },
    {
      name: "Volume Analytics",
      href: "/volume-analytics",
      icon: BarChart3,
    },
    {
      name: "Budget Planning",
      href: "/budget-planning",
      icon: LineChart,
    },
    {
      name: "Customers",
      href: "/customers",
      icon: Users,
    },
    {
      name: "Chat with AIMI",
      href: "/aimi",
      icon: MessageSquare,
    },
  ]

  return (
    <div className="flex flex-col border-r w-64 h-screen bg-background">
      <div className="p-6 flex items-center gap-2">
        <Database className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">Nadir Dashboard</span>
      </div>

      <nav className="flex-1 px-4 pt-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="rounded-md bg-primary/10 p-3">
          <p className="text-xs font-medium text-primary">PRO TIP</p>
          <p className="text-xs mt-1 text-muted-foreground">
            Use filters to narrow your analysis to specific sectors or areas
          </p>
        </div>
      </div>
    </div>
  )
}
