"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { FileText, Info, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { motion } from "framer-motion"

export default function CreateEscrowPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [step, setStep] = useState(1)
  const [escrowType, setEscrowType] = useState("condition")
  const [milestones, setMilestones] = useState([
    { title: "Initial Deposit", percentage: 20, completed: false },
    { title: "Shipping Confirmation", percentage: 30, completed: false },
    { title: "Customs Clearance", percentage: 30, completed: false },
    { title: "Delivery Confirmation", percentage: 20, completed: false },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [contractTitle, setContractTitle] = useState("")
  const searchParams = useSearchParams()
  const defaultPartnerAddress = searchParams.get("partner") || ""
  const [partnerAddress, setPartnerAddress] = useState(defaultPartnerAddress)
  const [escrowAmount, setEscrowAmount] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()

  const handleAddMilestone = () => {
    setMilestones([...milestones, { title: "", percentage: 0, completed: false }])
  }

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const handleUpdateMilestone = (index: number, field: string, value: any) => {
    const updated = [...milestones]
    updated[index] = { ...updated[index], [field]: value }
    setMilestones(updated)
  }

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleSubmit = async () => {
    setIsLoading(true)
  
    const payload = {
      contractTitle,
      partnerAddress,
      escrowAmount: parseFloat(escrowAmount),
      description,
      escrowType,
      milestones,
      userA: "rUFGBoYQjMUKVZtdh6tsyjQ3hd4RzYYerH", // 👈 임시로 넣어둠 (실제론 세션에서 가져와야 함)
      userB: partnerAddress,
    }
  
    try {
      const res = await fetch("/api/escrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
  
      const data = await res.json()
  
      if (data.success && data.payloads?.length > 0) {
        // 🎯 첫 번째 페이로드로 바로 이동
        const first = data.payloads[0]
        window.location.href = first.next
      } else {
        alert("❌ 페이로드 생성 실패: " + (data.error || "알 수 없는 오류"))
      }
    } catch (err) {
      console.error("🚨 에러 발생:", err)
      alert("에스크로 생성 중 오류가 발생했어요.")
    }
  
    setIsLoading(false)
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
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contract-title">Contract Title</Label>
                        <Input
                          id="contract-title"
                          placeholder="e.g., International Shipping Contract"
                          value={contractTitle}
                          onChange={(e) => setContractTitle(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="partner-address">Partner XRPL Address</Label>
                          <Input
                            id="partner-address"
                            value={partnerAddress}
                            onChange={(e) => setPartnerAddress(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="escrow-amount">Escrow Amount (XRP)</Label>
                          <Input
                            id="escrow-amount"
                            type="number"
                            placeholder="0.00"
                            value={escrowAmount}
                            onChange={(e) => setEscrowAmount(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Contract Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the purpose and terms of this escrow contract"
                          className="min-h-[100px]"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Escrow Type</Label>
                        <RadioGroup defaultValue="condition" onValueChange={setEscrowType} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Milestone Configuration</h3>
                        <Button variant="outline" size="sm" onClick={handleAddMilestone} disabled={milestones.length >= 6}>
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
                        ))}
                      </div>

                      <div className="flex items-center p-4 bg-blue-50 rounded-md border border-blue-200">
                        <Info className="h-5 w-5 text-blue-600 mr-2" />
                        <p className="text-sm text-blue-800">
                          Total percentage allocation: {milestones.reduce((sum, m) => sum + m.percentage, 0)}% (should be 100%)
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Review Escrow Details</h3>

                      <div className="border rounded-md divide-y">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Contract Title</h4>
                            <p>{contractTitle}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Escrow Amount</h4>
                            <p>{escrowAmount} XRP</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Partner Address</h4>
                            <p className="font-mono text-sm">{partnerAddress}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Escrow Type</h4>
                            <p>Milestone-Based Escrow</p>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-500">Milestones</h4>
                          <div className="mt-2 space-y-2">
                            {milestones.map((m, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span>{m.title}</span>
                                <span className="font-medium">{m.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-500">Description</h4>
                          <p className="text-sm">{description}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start space-x-3">
                        <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">Important Information</p>
                          <p className="mt-1">
                            Once created, this escrow contract will lock the specified amount of XRP until the release
                            conditions are met.
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
