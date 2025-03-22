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
import { Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const pollLoginStatus = (uuid: string, popup: Window | null) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/xumm-status?uuid=${uuid}`)
      const data = await res.json()

      if (data.success) {
        clearInterval(interval)

        if (popup && !popup.closed) {
          popup.close()
        }

        router.push("/dashboard")
      }
    }, 2000)
  }

  const handleXummLogin = async () => {
    setIsLoading(true)

    try {
      const res = await fetch("/api/xumm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()
      if (data?.next && data?.uuid) {
        const popup = window.open(
          data.next,
          "XUMMLoginPopup",
          "width=460,height=700"
        )

        pollLoginStatus(data.uuid, popup)

        const messageListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return
          if (event.data === "xumm:signed") {
            popup?.close()
            window.removeEventListener("message", messageListener)
            router.push("/dashboard")
          }
        }

        window.addEventListener("message", messageListener)
      }
    } catch (error) {
      console.error("XUMM login failed", error)
    } finally {
      setIsLoading(false)
    }
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
            <CardTitle className="text-2xl font-bold text-center">Sign in to Blogistics</CardTitle>
            <CardDescription className="text-center">
              Connect your wallet to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t p-6">
            <Button variant="ghost" className="text-gray-500 hover:text-gray-700" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
