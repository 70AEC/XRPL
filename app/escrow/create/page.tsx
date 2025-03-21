"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, FileText, Info, Plus, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"

export default function CreateEscrowPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [step, setStep] = useState(1)
  const [escrowType, setEscrowType] = useState("time")
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(undefined)
  const [milestones, setMilestones] = useState([
    { title: "Initial Deposit", percentage: 20, completed: false },
    { title: "Shipping Confirmation", percentage: 30, completed: false },
    { title: "Customs Clearance", percentage: 30, completed: false },
    { title: "Delivery Confirmation", percentage: 20, completed: false },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddMilestone = () => {
    setMilestones([...milestones, { title: "", percentage: 0, completed: false }])
  }

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const handleUpdateMilestone = (index: number, field: string, value: any) => {
    const updatedMilestones = [...milestones]
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value }
    setMilestones(updatedMilestones)
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/escrow/success")
    }, 2000)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Create Escrow Contract</h1>
              <p className="text-gray-500">Set up a new escrow contract with your logistics partner</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Escrow Details</CardTitle>
                <CardDescription>Configure your escrow contract parameters</CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contract-title">Contract Title</Label>
                        <Input id="contract-title" placeholder="e.g., International Shipping Contract" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="partner-address">Partner XRPL Address</Label>
                          <Input id="partner-address" placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="escrow-amount">Escrow Amount (XRP)</Label>
                          <Input id="escrow-amount" type="number" placeholder="0.00" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Contract Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the purpose and terms of this escrow contract"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Escrow Type</Label>
                        <RadioGroup
                          defaultValue="time"
                          onValueChange={setEscrowType}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                            <RadioGroupItem value="time" id="time" />
                            <Label htmlFor="time" className="flex items-center cursor-pointer">
                              <Clock className="w-5 h-5 mr-2 text-blue-600" />
                              <div>
                                <div className="font-medium">Time-Based Escrow</div>
                                <div className="text-sm text-gray-500">Release funds after a specific date</div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                            <RadioGroupItem value="condition" id="condition" />
                            <Label htmlFor="condition" className="flex items-center cursor-pointer">
                              <FileText className="w-5 h-5 mr-2 text-blue-600" />
                              <div>
                                <div className="font-medium">Milestone-Based Escrow</div>
                                <div className="text-sm text-gray-500">Release funds based on completed milestones</div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {escrowType === "time" ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Release Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {releaseDate ? format(releaseDate, "PPP") : "Select a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={releaseDate} onSelect={setReleaseDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="cancel-after">Cancel After (days)</Label>
                            <span className="text-sm text-gray-500">30 days</span>
                          </div>
                          <Slider defaultValue={[30]} min={1} max={90} step={1} />
                          <p className="text-sm text-gray-500">
                            If the escrow is not executed by the release date, it can be cancelled after this many days.
                          </p>
                        </div>

                        <div className="space-y-2 border-t pt-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="require-destination-tag">Require Destination Tag</Label>
                            <Switch id="require-destination-tag" />
                          </div>
                          <p className="text-sm text-gray-500">
                            Require a destination tag when releasing funds to the recipient.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enable-notifications">Enable Email Notifications</Label>
                            <Switch id="enable-notifications" defaultChecked />
                          </div>
                          <p className="text-sm text-gray-500">
                            Receive email notifications about escrow status changes.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Milestone Configuration</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddMilestone}
                            disabled={milestones.length >= 6}
                          >
                            <Plus className="mr-1 h-4 w-4" /> Add Milestone
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {milestones.map((milestone, index) => (
                            <div key={index} className="border rounded-md p-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">Milestone {index + 1}</h4>
                                {milestones.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveMilestone(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>

                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`milestone-${index}-title`}>Title</Label>
                                  <Input
                                    id={`milestone-${index}-title`}
                                    value={milestone.title}
                                    onChange={(e) => handleUpdateMilestone(index, "title", e.target.value)}
                                    placeholder="e.g., Shipping Confirmation"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor={`milestone-${index}-percentage`}>Percentage</Label>
                                    <span className="text-sm text-gray-500">{milestone.percentage}%</span>
                                  </div>
                                  <Slider
                                    id={`milestone-${index}-percentage`}
                                    defaultValue={[milestone.percentage]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    onValueChange={(value) => handleUpdateMilestone(index, "percentage", value[0])}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center p-4 bg-blue-50 rounded-md border border-blue-200">
                          <Info className="h-5 w-5 text-blue-600 mr-2" />
                          <p className="text-sm text-blue-800">
                            Total percentage allocation: {milestones.reduce((sum, m) => sum + m.percentage, 0)}% (should
                            equal 100%)
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Review Escrow Details</h3>

                      <div className="border rounded-md divide-y">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Contract Title</h4>
                            <p>International Shipping Contract</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Escrow Amount</h4>
                            <p>25,000 XRP</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Partner Address</h4>
                            <p className="font-mono text-sm">rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Escrow Type</h4>
                            <p>{escrowType === "time" ? "Time-Based Escrow" : "Milestone-Based Escrow"}</p>
                          </div>
                        </div>

                        {escrowType === "time" ? (
                          <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-500">Release Date</h4>
                            <p>{releaseDate ? format(releaseDate, "PPP") : "Not set"}</p>
                          </div>
                        ) : (
                          <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-500">Milestones</h4>
                            <div className="mt-2 space-y-2">
                              {milestones.map((milestone, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span>{milestone.title}</span>
                                  <span className="font-medium">{milestone.percentage}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-500">Description</h4>
                          <p className="text-sm">
                            This escrow contract is for international shipping services between our company and Global
                            Logistics Inc.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start space-x-3">
                        <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">Important Information</p>
                          <p className="mt-1">
                            Once created, this escrow contract will lock the specified amount of XRP until the release
                            conditions are met. Please review all details carefully before proceeding.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                {step > 1 ? (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                )}

                {step < 3 ? (
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNext}>
                    Continue
                  </Button>
                ) : (
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Creating Escrow..." : "Create Escrow Contract"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

