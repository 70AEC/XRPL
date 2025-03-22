"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, KeyRound } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleXummLogin = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/xumm ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.next) {
        window.open(data.next, '_blank');
      }
    } catch (error) {
      console.error('XUMM login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 2000);
  };


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
            <CardTitle className="text-2xl font-bold text-center">Sign in to Blogistics</CardTitle>
            <CardDescription className="text-center">
              Connect with your wallet or credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="wallet" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
              </TabsList>
              <TabsContent value="wallet">
                <div className="space-y-4">
                  <Button
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleXummLogin}
                    disabled={isLoading}
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    {isLoading ? "Connecting..." : "Connect with XUMM"}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="credentials">
                <form onSubmit={handleCredentialLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    <KeyRound className="w-5 h-5 mr-2" />
                    {isLoading ? "Signing in..." : "Sign in with Email"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t p-6">
            <div className="text-center text-sm">
              Don't have an account? {" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Sign up
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
