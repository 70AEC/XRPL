"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Clock, DollarSign, FileCheck, Lock } from "lucide-react"

type EscrowTx = {
  amount: string
  memos: { type: string; data: any }[]
}

export default function EscrowStats() {
  const [statsData, setStatsData] = useState({
    totalValue: 0,
    totalValueChange: 0,
    activeContracts: 0,
    activeContractsChange: 0,
    pendingReleases: 0,
    completedEscrows: 0,
    completedEscrowsChange: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/transactions")
        const data = await res.json()

        if (data.escrows) {
          const escrows: EscrowTx[] = data.escrows

          let today = new Date()
          let todayMidnight = new Date(today)
          todayMidnight.setHours(0, 0, 0, 0)

          const yesterdayMidnight = new Date(todayMidnight)
          yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1)

          let totalToday = 0
          let totalYesterday = 0
          let activeToday = 0
          let activeYesterday = 0
          let completedToday = 0
          let completedYesterday = 0
          let pendingReleases = 0

          escrows.forEach((tx) => {
            const createdAt = tx.memos.find((m) => m.type === "parent_contract")?.data?.createdAt
            const date = createdAt ? new Date(createdAt) : null
            const amountXRP = parseFloat(tx.amount) / 1_000_000

            const milestone = tx.memos.find((m) => m.type === "milestone")
            const completed = milestone?.data?.completed === true

            if (!date) return

            if (date >= todayMidnight) {
              totalToday += amountXRP
              activeToday++
              if (completed) completedToday++
              else pendingReleases++
            } else if (date >= yesterdayMidnight && date < todayMidnight) {
              totalYesterday += amountXRP
              activeYesterday++
              if (completed) completedYesterday++
              else pendingReleases++
            } else {
              if (completed) completedYesterday++
              else pendingReleases++
              totalYesterday += amountXRP
              activeYesterday++
            }
          })

          setStatsData({
            totalValue: totalToday,
            totalValueChange: totalToday - totalYesterday,
            activeContracts: activeToday,
            activeContractsChange: activeToday - activeYesterday,
            completedEscrows: completedToday,
            completedEscrowsChange: completedToday - completedYesterday,
            pendingReleases,
          })
        }
      } catch (err) {
        console.error("Failed to load escrow stats:", err)
      }
    }

    fetchStats()
  }, [])

  const formatChange = (val: number) => {
    const sign = val > 0 ? "+" : val < 0 ? "-" : ""
    return `${sign}${Math.abs(val).toFixed(1)}`
  }

  const getTrend = (val: number) => {
    if (val > 0) return "up"
    if (val < 0) return "down"
    return "neutral"
  }

  const stats = [
    {
      title: "Total Escrow Value",
      value: statsData.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      unit: "XRP",
      change: formatChange(statsData.totalValueChange),
      trend: getTrend(statsData.totalValueChange),
      icon: DollarSign,
    },
    {
      title: "Active Contracts",
      value: statsData.activeContracts.toString(),
      change: formatChange(statsData.activeContractsChange),
      trend: getTrend(statsData.activeContractsChange),
      icon: FileCheck,
    },
    {
      title: "Pending Releases",
      value: statsData.pendingReleases.toString(),
      change: "0",
      trend: "neutral",
      icon: Clock,
    },
    {
      title: "Completed Escrows",
      value: statsData.completedEscrows.toString(),
      change: formatChange(statsData.completedEscrowsChange),
      trend: getTrend(statsData.completedEscrowsChange),
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
                {stat.trend === "up" && <ArrowUp className="h-4 w-4 text-green-600" />}
                {stat.trend === "down" && <ArrowDown className="h-4 w-4 text-red-600" />}
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
