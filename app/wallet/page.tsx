"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, ExternalLink, RefreshCw, Send, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"

export default function WalletPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [walletAddress, setWalletAddress] = useState("")
  const [balance, setBalance] = useState("")
  const [copied, setCopied] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [txHash, setTxHash] = useState("")
  const [loading, setLoading] = useState(false)
  const [uuid, setUuid] = useState("")
  const [popup, setPopup] = useState<Window | null>(null)

  // 지갑 세션 불러오기
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/me")
      const data = await res.json()
      if (data.loggedIn) {
        setWalletAddress(data.address)
      }
    } catch (err) {
      console.error("Failed to fetch session:", err)
    }
  }

  // 잔액 가져오기
  const fetchBalance = async () => {
    if (!walletAddress) return
    try {
      const res = await fetch(`/api/xrpl/balance?address=${walletAddress}`)
      const data = await res.json()
      if (data.success) {
        setBalance((parseFloat(data.balance) / 1_000_000).toFixed(6))
      }
    } catch (err) {
      console.error("Failed to fetch balance:", err)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSend = async () => {
    if (!recipient || !amount) return
    setLoading(true)
    try {
      const res = await fetch("/api/xrpl/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: walletAddress,
          to: recipient,
          amount,
        }),
      })

      const data = await res.json()
      if (data.uuid && data.next) {
        setUuid(data.uuid)
        const newPopup = window.open(data.next, "XUMMSendPopup", "width=460,height=700")
        setPopup(newPopup)
      } else {
        alert("Failed to initiate transaction: " + data.error)
      }
    } catch (err) {
      alert("Transaction initiation error")
    } finally {
      setLoading(false)
    }
  }

  // 송금 상태 확인
  useEffect(() => {
    if (!uuid) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/xrpl/send-status?uuid=${uuid}`)
        const data = await res.json()

        if (data.success && data.signed) {
          setTxHash(data.txid)
          await fetchBalance()
          if (popup) {
            popup.close()
          }
          clearInterval(interval)
        }
      } catch (err) {
        console.error("Failed to fetch transaction status:", err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [uuid, popup])

  useEffect(() => {
    fetchSession()
  }, [])

  useEffect(() => {
    if (walletAddress) fetchBalance()
  }, [walletAddress])

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">XRPL Wallet</h1>
              <p className="text-gray-500">Manage your XRP Ledger wallet and transactions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Wallet Details</CardTitle>
                  <CardDescription>View and manage your XRPL wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {walletAddress ? (
                    <>
                      <div className="space-y-2">
                        <Label>Wallet Address</Label>
                        <div className="flex items-center">
                          <Input value={walletAddress} readOnly className="font-mono text-sm" />
                          <Button variant="ghost" size="icon" className="ml-2" onClick={handleCopy}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="pt-4 flex justify-between">
                        <Button variant="outline" onClick={() => setWalletAddress("")}>
                          Disconnect Wallet
                        </Button>
                        <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50" asChild>
                          <a
                            href={`https://testnet.xrpl.org/accounts/${walletAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on Explorer <ExternalLink className="ml-1 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8">No wallet connected.</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Balance</CardTitle>
                  <CardDescription>Your current XRP balance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {walletAddress ? (
                    <>
                                            <div className="text-center py-4">
                        <div className="text-3xl font-bold">{balance || "0.000000"} XRP</div>
                        <div className="text-sm text-gray-500 mt-1">on Testnet</div>
                      </div>
                      <Button className="w-full" variant="outline" onClick={fetchBalance}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh Balance
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">Connect your wallet to view balance</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {walletAddress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Send XRP</CardTitle>
                    <CardDescription>Transfer XRP to another address using XUMM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient Address</Label>
                        <Input
                          id="recipient"
                          placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (XRP)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      {txHash && (
                        <div className="text-sm text-green-600">
                          ✅ Sent successfully! TX Hash:{" "}
                          <a
                            href={`https://testnet.xrpl.org/transactions/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {txHash}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => {
                      setRecipient("")
                      setAmount("")
                      setTxHash("")
                    }}>
                      Clear
                    </Button>
                    <Button onClick={handleSend} disabled={loading || !recipient || !amount}>
                      <Send className="mr-2 h-4 w-4" /> {loading ? "Sending..." : "Send XRP"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
