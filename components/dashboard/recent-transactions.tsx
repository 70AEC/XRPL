"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowRight, ArrowUp, Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export default function RecentTransactions() {
  const transactions = [
    {
      id: "TXN-001",
      date: "2025-03-20",
      type: "Escrow Create",
      description: "International Shipping Contract",
      amount: 25000,
      currency: "XRP",
      status: "Completed",
      direction: "outgoing",
    },
    {
      id: "TXN-002",
      date: "2025-03-18",
      type: "Escrow Release",
      description: "Warehouse Storage Payment",
      amount: 5000,
      currency: "XRP",
      status: "Completed",
      direction: "incoming",
    },
    {
      id: "TXN-003",
      date: "2025-03-15",
      type: "Escrow Cancel",
      description: "Cancelled Freight Contract",
      amount: 12000,
      currency: "XRP",
      status: "Cancelled",
      direction: "refund",
    },
    {
      id: "TXN-004",
      date: "2025-03-12",
      type: "Escrow Create",
      description: "Domestic Freight Services",
      amount: 8500,
      currency: "XRP",
      status: "Pending",
      direction: "outgoing",
    },
    {
      id: "TXN-005",
      date: "2025-03-10",
      type: "Escrow Release",
      description: "International Shipping Milestone",
      amount: 10000,
      currency: "XRP",
      status: "Completed",
      direction: "outgoing",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>View your recent escrow transactions and their status</CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search transactions..." className="pl-8 h-9 w-[200px] sm:w-[300px]" />
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
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {transaction.direction === "incoming" ? (
                        <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                      ) : transaction.direction === "outgoing" ? (
                        <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                      ) : (
                        <ArrowRight className="mr-1 h-4 w-4 text-gray-600" />
                      )}
                      <span
                        className={
                          transaction.direction === "incoming"
                            ? "text-green-600"
                            : transaction.direction === "outgoing"
                              ? "text-red-600"
                              : "text-gray-600"
                        }
                      >
                        {transaction.amount.toLocaleString()} {transaction.currency}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "Completed"
                          ? "default"
                          : transaction.status === "Pending"
                            ? "outline"
                            : "secondary"
                      }
                      className={
                        transaction.status === "Completed"
                          ? "bg-green-500"
                          : transaction.status === "Pending"
                            ? "border-yellow-500 text-yellow-500"
                            : "bg-red-500"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/transactions/${transaction.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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

