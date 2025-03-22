"use client"

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

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleXummRegister = async () => {
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
          "XUMMRegisterPopup",
          "width=460,height=700"
        )

        const interval = setInterval(async () => {
          const res = await fetch(`/api/xumm-status?uuid=${data.uuid}`)
          const status = await res.json()

          if (status.success) {
            clearInterval(interval)
            popup?.close()
            router.push("/kyb")
          }
        }, 2000)

        const messageListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return
          if (event.data === "xumm:signed") {
            popup?.close()
            window.removeEventListener("message", messageListener)
            router.push("/kyb")
          }
        }

        window.addEventListener("message", messageListener)
      }
    } catch (error) {
      console.error("XUMM registration failed", error)
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
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Register quickly using your XUMM wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleXummRegister}
              disabled={isLoading}
            >
              <Wallet className="w-5 h-5 mr-2" />
              {isLoading ? "Connecting..." : "Register with XUMM"}
            </Button>
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

