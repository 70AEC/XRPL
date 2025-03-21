"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Clock, DollarSign, FileCheck, Lock } from "lucide-react"

export default function EscrowStats() {
  const stats = [
    {
      title: "Total Escrow Value",
      value: "45,500",
      unit: "XRP",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Contracts",
      value: "3",
      change: "+1",
      trend: "up",
      icon: FileCheck,
    },
    {
      title: "Pending Releases",
      value: "2",
      change: "0",
      trend: "neutral",
      icon: Clock,
    },
    {
      title: "Completed Escrows",
      value: "8",
      change: "+3",
      trend: "up",
      icon: Lock,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center space-x-1">
                <span
                  className={
                    stat.trend === "up"
                      ? "text-green-600 text-sm"
                      : stat.trend === "down"
                        ? "text-red-600 text-sm"
                        : "text-gray-600 text-sm"
                  }
                >
                  {stat.change}
                </span>
                {stat.trend === "up" ? (
                  <ArrowUp className="h-4 w-4 text-green-600" />
                ) : stat.trend === "down" ? (
                  <ArrowDown className="h-4 w-4 text-red-600" />
                ) : null}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{stat.value}</span>
                {stat.unit && <span className="ml-1 text-gray-500">{stat.unit}</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

