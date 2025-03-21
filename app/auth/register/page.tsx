"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Wallet, UserPlus } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleWalletConnect = async () => {
    setIsLoading(true)
    // Simulate wallet connection
    setTimeout(() => {
      setIsLoading(false)
      router.push("/kyb")
    }, 2000)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      router.push("/kyb")
    }, 2000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Register with your wallet or create credentials to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleWalletConnect}
                disabled={isLoading}
              >
                <Wallet className="w-5 h-5 mr-2" />
                {isLoading ? "Connecting..." : "Register with TrustWallet"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-white text-gray-500">Or register with email</span>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company name</Label>
                  <Input id="company" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      privacy policy
                    </Link>
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t p-6">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
            <Button variant="ghost" className="text-gray-500 hover:text-gray-700" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

