"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Home, FileText, Clock, Users, Settings, HelpCircle, X, Wallet, BarChart3, Store } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Marketplace",
      icon: Store,
      href: "/marketplace",
      active: pathname === "/marketplace" || pathname.startsWith("/marketplace/"),
    },
    {
      label: "Escrow Contracts",
      icon: FileText,
      href: "/escrow",
      active: pathname === "/escrow" || pathname.startsWith("/escrow/"),
    },
    {
      label: "Transactions",
      icon: Clock,
      href: "/transactions",
      active: pathname === "/transactions",
    },
    {
      label: "Wallet",
      icon: Wallet,
      href: "/wallet",
      active: pathname === "/wallet",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      active: pathname === "/analytics",
    },
    {
      label: "Partners",
      icon: Users,
      href: "/partners",
      active: pathname === "/partners",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
    {
      label: "Help & Support",
      icon: HelpCircle,
      href: "/support",
      active: pathname === "/support",
    },
  ]

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-black/80 lg:hidden", open ? "block" : "hidden")}
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-blue-600" />
            <span className="font-medium text-xl">Blogistics</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  route.active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <route.icon className={cn("mr-3 h-5 w-5", route.active ? "text-blue-700" : "text-gray-500")} />
                {route.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

