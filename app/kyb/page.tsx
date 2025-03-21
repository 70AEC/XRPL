"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/file-uploader"
import { CheckCircle, ArrowRight, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export default function KYBPage() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(step + 1)
      setProgress(progress + 25)
    }, 1000)
  }

  const handleSubmit = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Business Verification</CardTitle>
            <CardDescription className="text-center">
              Complete the KYB process to access the full platform
            </CardDescription>
            <Progress value={progress} className="h-2 mt-4" />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Business Info</span>
              <span>Documents</span>
              <span>Verification</span>
              <span>Confirmation</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h3 className="text-lg font-medium">Business Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Legal Business Name</Label>
                    <Input id="business-name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-type">Business Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporation">Corporation</SelectItem>
                          <SelectItem value="llc">LLC</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration-number">Registration Number</Label>
                      <Input id="registration-number" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-address">Business Address</Label>
                    <Input id="business-address" required />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Postal Code</Label>
                      <Input id="zip" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h3 className="text-lg font-medium">Business Documents</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Business Registration Certificate</Label>
                    <FileUploader accept=".pdf,.jpg,.png" maxSize={5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Identification Document</Label>
                    <FileUploader accept=".pdf,.jpg,.png" maxSize={5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Proof of Address (utility bill, bank statement)</Label>
                    <FileUploader accept=".pdf,.jpg,.png" maxSize={5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Director/Owner ID (passport or government ID)</Label>
                    <FileUploader accept=".pdf,.jpg,.png" maxSize={5} />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h3 className="text-lg font-medium">Verification Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Primary Contact Name</Label>
                    <Input id="contact-name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input id="contact-email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input id="contact-phone" type="tel" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-description">Business Description</Label>
                    <Textarea
                      id="business-description"
                      placeholder="Briefly describe your business and how you plan to use our platform"
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="xrpl-address">XRPL Wallet Address (optional)</Label>
                    <Input id="xrpl-address" placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium">Verification Submitted</h3>
                  <p className="text-gray-500">
                    Your business verification has been submitted successfully. Our team will review your information
                    and documents.
                  </p>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start space-x-3 mt-4">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-left text-blue-800">
                      <p className="font-medium">Verification typically takes 1-2 business days</p>
                      <p className="mt-1">
                        You can start exploring the platform now, but some features will be limited until verification
                        is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            {step > 1 && step < 4 ? (
              <Button
                variant="outline"
                onClick={() => {
                  setStep(step - 1)
                  setProgress(progress - 25)
                }}
                disabled={isLoading}
              >
                Back
              </Button>
            ) : (
              <div></div>
            )}
            {step < 4 ? (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNext} disabled={isLoading}>
                {isLoading ? "Processing..." : "Next Step"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Redirecting..." : "Continue to Dashboard"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

