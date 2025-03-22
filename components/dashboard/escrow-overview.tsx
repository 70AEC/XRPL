"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CheckCircle, Clock, FileCheck, Lock, TruckIcon } from "lucide-react"
import Link from "next/link"

type EscrowItem = {
  id: string
  title: string
  partner: string
  amount: number
  currency: string
  status: string
  progress: number
  nextMilestone: string
  dueDate: string
}

export default function EscrowOverview() {
  const [activeEscrows, setActiveEscrows] = useState<EscrowItem[]>([])

  useEffect(() => {
    const fetchEscrows = async () => {
      try {
        const res = await fetch("/api/transactions")
        const data = await res.json()

        if (data.escrows) {
          const sorted = data.escrows
            .sort((a: any, b: any) => b.finishAfter - a.finishAfter)
            .slice(0, 5)

          const processed = sorted.map((tx: any, index: number): EscrowItem => {
            const parent = tx.memos.find((m: any) => m.type === "parent_contract")?.data
            const milestone = tx.memos.find((m: any) => m.type === "milestone")?.data

            const amount = parseFloat(tx.amount) / 1_000_000
            const dueDate = tx.finishAfter ? new Date(tx.finishAfter * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }) : "Unknown"

            const status = milestone?.completed === true
              ? "Completed"
              : parent?.approved === false
              ? "Pending Approval"
              : "In Progress"

            return {
              id: `ESC-${index + 1}`.padStart(7, "0"),
              title: parent?.contractTitle || "Untitled Escrow",
              partner: parent?.userB || tx.destination || "Unknown",
              amount,
              currency: "XRP",
              status,
              progress: milestone?.percentage || 0,
              nextMilestone: milestone?.title || "N/A",
              dueDate,
            }
          })

          setActiveEscrows(processed)
        }
      } catch (err) {
        console.error("Failed to fetch escrows:", err)
      }
    }

    fetchEscrows()
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Escrow Contracts</CardTitle>
          <CardDescription>Showing your 5 most recent escrow contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeEscrows.map((escrow) => (
              <div key={escrow.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{escrow.title}</h3>
                      <Badge
                        variant={
                          escrow.status === "In Progress"
                            ? "default"
                            : escrow.status === "Pending Approval"
                            ? "outline"
                            : "secondary"
                        }
                        className={
                          escrow.status === "In Progress"
                            ? "bg-blue-500"
                            : escrow.status === "Pending Approval"
                            ? "border-yellow-500 text-yellow-500"
                            : "bg-purple-500"
                        }
                      >
                        {escrow.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Partner: {escrow.partner} | ID: {escrow.id}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <div className="text-lg font-semibold">
                      {escrow.amount.toLocaleString()} {escrow.currency}
                    </div>
                    <p className="text-sm text-gray-500">Due: {escrow.dueDate}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{escrow.progress}%</span>
                  </div>
                  <Progress value={escrow.progress} className="h-2" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>Next: {escrow.nextMilestone}</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 sm:mt-0" asChild>
                    <Link href={`/escrow/${escrow.id}`}>
                      View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/escrow">
                View All Escrow Contracts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
