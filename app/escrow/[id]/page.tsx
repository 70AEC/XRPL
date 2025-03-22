"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowRight, CheckCircle, Clock, Copy, ExternalLink, FileText, Lock, Unlock } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"

export default function EscrowDetailsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const params = useParams()
  const router = useRouter()
  const escrowId = params.id

  // Mock escrow data
  const escrow = {
    id: escrowId,
    title: "International Shipping Contract",
    partner: "Global Logistics Inc.",
    partnerAddress: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    amount: 25000,
    currency: "XRP",
    status: "In Progress",
    progress: 50,
    type: "Time-Based",
    createDate: "Mar 20, 2025",
    releaseDate: "Mar 28, 2025",
    cancelAfter: "Apr 28, 2025",
    offerSequence: 12345678,
    txHash: "0x123456789ABCDEF...",
    description:
      "This escrow contract is for international shipping services between our company and Global Logistics Inc.",
    milestones: [
      { title: "Initial Deposit", percentage: 20, completed: true, date: "Mar 20, 2025" },
      { title: "Shipping Confirmation", percentage: 30, completed: true, date: "Mar 22, 2025" },
      { title: "Customs Clearance", percentage: 30, completed: false, date: "Pending" },
      { title: "Delivery Confirmation", percentage: 20, completed: false, date: "Pending" },
    ],
    events: [
      { type: "Created", date: "Mar 20, 2025 09:15 AM", description: "Escrow contract created" },
      { type: "Payment", date: "Mar 20, 2025 09:15 AM", description: "Initial deposit of 5,000 XRP" },
      { type: "Milestone", date: "Mar 22, 2025 02:30 PM", description: "Shipping confirmation milestone completed" },
      { type: "Payment", date: "Mar 22, 2025 02:35 PM", description: "Released 7,500 XRP for shipping confirmation" },
    ],
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReleaseEscrow = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/escrow/release-success")
    }, 2000)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{escrow.title}</h1>
                  <Badge className="ml-3 bg-blue-500">{escrow.status}</Badge>
                </div>
                <p className="text-gray-500">Escrow ID: {escrow.id}</p>
              </div>

              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button variant="outline" className="border-blue-600 text-black hover:bg-blue-50 hover:text-blue-700" asChild>
                  <a
                    href={`https://testnet.xrpl.org/transactions/${escrow.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Explorer <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleReleaseEscrow} disabled={isLoading}>
                  {isLoading ? "Processing..." : "Release Funds"}
                  <Unlock className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Escrow Details</CardTitle>
                    <CardDescription>Overview of the escrow contract</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                          <p className="text-lg font-semibold">
                            {escrow.amount.toLocaleString()} {escrow.currency}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Escrow Type</h3>
                          <p>{escrow.type}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                          <p>{escrow.createDate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Release Date</h3>
                          <p>{escrow.releaseDate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Cancel After</h3>
                          <p>{escrow.cancelAfter}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Partner</h3>
                        <div className="flex items-center">
                          <p>{escrow.partner}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Partner XRPL Address</h3>
                        <div className="flex items-center">
                          <p className="font-mono text-sm truncate">{escrow.partnerAddress}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={() => handleCopy(escrow.partnerAddress)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Offer Sequence</h3>
                        <p className="font-mono text-sm">{escrow.offerSequence}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <p className="text-sm">{escrow.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Progress</CardTitle>
                    <CardDescription>Current progress and milestones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{escrow.progress}%</span>
                      </div>
                      <Progress value={escrow.progress} className="h-2" />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Milestones</h3>
                      <div className="space-y-4">
                        {escrow.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-start">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                                milestone.completed ? "bg-green-100" : "bg-gray-100"
                              }`}
                            >
                              {milestone.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Clock className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{milestone.title}</h4>
                                <span className="text-sm font-medium">{milestone.percentage}%</span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {milestone.completed ? `Completed on ${milestone.date}` : `Pending`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Available actions for this escrow</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Unlock className="mr-2 h-4 w-4" /> Release Funds
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" /> View Invoice
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Lock className="mr-2 h-4 w-4" /> Cancel Escrow
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>Recent events for this escrow</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {escrow.events.map((event, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4 pb-4">
                          <div className="flex items-start">
                            <div className="flex-1">
                              <p className="font-medium">{event.type}</p>
                              <p className="text-sm text-gray-500">{event.date}</p>
                              <p className="text-sm mt-1">{event.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p>If you need assistance with this escrow contract, our support team is available to help.</p>
                        <Button variant="link" className="p-0 h-auto text-blue-600" asChild>
                          <Link href="/support">
                            Contact Support <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

