"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Copy, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"

export default function ReleaseSuccessPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText("TXN-006")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Funds Released Successfully!</CardTitle>
                  <CardDescription>The escrow funds have been released to the recipient</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="border rounded-md divide-y">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500">Transaction ID</h3>
                      <div className="mt-1 flex items-center">
                        <span className="font-medium">TXN-006</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={handleCopy}
                        >
                          {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500">Transaction Hash</h3>
                      <div className="mt-1">
                        <a
                          href="https://testnet.xrpl.org/transactions/123456789ABCDEF"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm text-blue-600 hover:underline flex items-center"
                        >
                          0x 123456789ABCDEF...
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500">Release Details</h3>
                      <div className="mt-1 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">7,500 XRP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Recipient:</span>
                          <span>Global Logistics Inc.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Milestone:</span>
                          <span>Customs Clearance</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span>Mar 21, 2025 10:15 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Escrow Progress Updated</p>
                      <p className="mt-1">
                        The escrow contract has been updated to reflect this milestone completion. The overall progress
                        is now at 80%.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 pt-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/escrow/ESC-001">Return to Escrow Details</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

