"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, ExternalLink, Eye, EyeOff, RefreshCw, Send, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { useWallet } from "@/hooks/use-wallet"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"

export default function WalletPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showSeed, setShowSeed] = useState(false)
  const [copied, setCopied] = useState(false)
  const { wallet, isConnected, connect, disconnect } = useWallet()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConnect = () => {
    connect()
  }

  const handleDisconnect = () => {
    disconnect()
  }

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
                <CardContent className="space-y-6">
                  {isConnected && wallet ? (
                    <>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Wallet Address</Label>
                          <div className="flex items-center">
                            <Input value={wallet.address} readOnly className="font-mono text-sm" />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2"
                              onClick={() => handleCopy(wallet.address)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="pt-4 flex justify-between">
                          <Button variant="outline" onClick={handleDisconnect}>
                            Disconnect Wallet
                          </Button>
                          <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50" asChild>
                            <a
                              href={`https://testnet.xrpl.org/accounts/${wallet.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View on Explorer <ExternalLink className="ml-1 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <Wallet className="h-16 w-16 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900">No Wallet Connected</h3>
                      <p className="text-gray-500 text-center max-w-md">
                        Connect your XRPL wallet to manage escrow contracts and transactions.
                      </p>
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleConnect}>
                        Connect Wallet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Balance</CardTitle>
                  <CardDescription>Your current XRP balance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isConnected ? (
                    <>
                      <div className="text-center py-4">
                        <div className="text-3xl font-bold">25,000 XRP</div>
                        <div className="text-sm text-gray-500 mt-1">≈ $12,500 USD</div>
                      </div>
                      <Button className="w-full" variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh Balance
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">Connect your wallet to view balance</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {isConnected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Send XRP</CardTitle>
                    <CardDescription>Transfer XRP to another address</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient Address</Label>
                        <Input id="recipient" placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (XRP)</Label>
                          <Input id="amount" type="number" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tag">Destination Tag (Optional)</Label>
                          <Input id="tag" type="number" placeholder="Enter tag number" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memo">Memo (Optional)</Label>
                        <Input id="memo" placeholder="Add a note to this transaction" />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Clear</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Send className="mr-2 h-4 w-4" /> Send XRP
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

