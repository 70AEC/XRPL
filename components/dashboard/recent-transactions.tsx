"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Download,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"

type Transaction = {
  id: string
  date: string
  type: string
  description: string
  amount: number
  currency: string
  status: "Completed" | "Pending" | "Cancelled"
  direction: "incoming" | "outgoing" | "refund"
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions")
        const data = await res.json()

        if (data.escrows) {
          const mapped = data.escrows.map((item: any, index: number) => {
            const milestoneMemo = item.memos.find((m: any) => m.type === "milestone")
            const description = milestoneMemo?.data?.title || "Unknown milestone"
            const amount = parseFloat(item.amount) / 1_000_000

            return {
              id: `TXN-${index + 1}`.padStart(7, "0"),
              date: new Date(item.finishAfter * 1000).toISOString().split("T")[0],
              type: "Escrow Create",
              description,
              amount,
              currency: "XRP",
              status: milestoneMemo?.data?.completed ? "Completed" : "Pending",
              direction: "outgoing",
            }
          })

          const sorted = mapped.sort(
            (a: { date: string | number | Date }, b: { date: string | number | Date }) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )

          setTransactions(sorted)
        }
      } catch (err) {
        console.error("Failed to fetch transactions", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              View your recent escrow transactions and their status
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 h-9 w-[200px] sm:w-[300px]"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.id}</TableCell>
                    <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {tx.direction === "incoming" ? (
                          <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                        ) : tx.direction === "outgoing" ? (
                          <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                        ) : (
                          <ArrowRight className="mr-1 h-4 w-4 text-gray-600" />
                        )}
                        <span
                          className={
                            tx.direction === "incoming"
                              ? "text-green-600"
                              : tx.direction === "outgoing"
                              ? "text-red-600"
                              : "text-gray-600"
                          }
                        >
                          {tx.amount.toLocaleString()} {tx.currency}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.status === "Completed"
                            ? "default"
                            : tx.status === "Pending"
                              ? "outline"
                              : "secondary"
                        }
                        className={
                          tx.status === "Completed"
                            ? "bg-green-500"
                            : tx.status === "Pending"
                              ? "border-yellow-500 text-yellow-500"
                              : "bg-red-500"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/transactions/${tx.id}`}>Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link href="/transactions">
              View All Transactions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
