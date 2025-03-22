"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CheckCircle, Clock, FileCheck, Lock, TruckIcon } from "lucide-react"
import Link from "next/link"

export default function EscrowOverview() {
  const activeEscrows = [
    {
      id: "ESC-001",
      title: "International Shipping Contract",
      partner: "Global Logistics Inc.",
      amount: 25000,
      currency: "XRP",
      status: "In Progress",
      progress: 50,
      nextMilestone: "Customs Clearance",
      dueDate: "Mar 28, 2025",
    },
    {
      id: "ESC-002",
      title: "Domestic Freight Services",
      partner: "FastTrack Shipping",
      amount: 8500,
      currency: "XRP",
      status: "Pending Approval",
      progress: 25,
      nextMilestone: "Carrier Assignment",
      dueDate: "Apr 05, 2025",
    },
    {
      id: "ESC-003",
      title: "Warehouse Storage Contract",
      partner: "SecureStorage Solutions",
      amount: 12000,
      currency: "XRP",
      status: "Awaiting Payment",
      progress: 15,
      nextMilestone: "Initial Payment",
      dueDate: "Mar 25, 2025",
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Escrow Contracts</CardTitle>
          <CardDescription>Monitor your ongoing escrow contracts and their current status</CardDescription>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Escrow Templates</CardTitle>
            <CardDescription>Quickly create new escrow contracts using templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Standard Shipping Escrow",
                  description: "Basic escrow for standard shipping services",
                  icon: TruckIcon,
                },
                {
                  title: "Time-Based Release",
                  description: "Automatic releases based on predefined timeframes",
                  icon: Clock,
                },
                {
                  title: "Milestone-Based Escrow",
                  description: "Releases funds upon completion of specific milestones",
                  icon: FileCheck,
                },
              ].map((template, index) => (
                <div key={index} className="flex items-start p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-3">
                    <template.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{template.title}</h4>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Current status of your business verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-black">KYB Verification</h4>
                    <p className="text-sm text-gray-600">Business identity verified</p>
                  </div>
                </div>
                <Badge className="bg-green-600">Verified</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-black">XRPL Wallet</h4>
                    <p className="text-sm text-gray-600">Wallet connected and verified</p>
                  </div>
                </div>
                <Badge className="bg-blue-600">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileCheck className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <h4 className="font-medium">Transaction Limit</h4>
                    <p className="text-sm text-gray-600">Current monthly limit</p>
                  </div>
                </div>
                <span className="font-medium">100,000 XRP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

