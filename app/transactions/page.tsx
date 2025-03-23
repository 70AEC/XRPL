"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { format } from "date-fns"

type Memo = {
  type: string
  data: any
}

type EscrowTx = {
  hash: string
  amount: string
  destination: string
  finishAfter: number
  cancelAfter: number
  memos: Memo[]
  sequence: number
}

export default function TransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [transactions, setTransactions] = useState<EscrowTx[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const meRes = await fetch("/api/me")
      const meData = await meRes.json()
      if (meData.loggedIn && meData.address) {
        document.cookie = `xrp_address=${meData.address}; path=/;`
      }

      const txRes = await fetch("/api/transactions")
      const txData = await txRes.json()
      if (txData.escrows) {
        const sorted = txData.escrows.sort((a: any, b: any) => b.finishAfter - a.finishAfter)
        setTransactions(sorted)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const formatXRP = (drops: string) => (parseFloat(drops) / 1_000_000).toFixed(6) + " XRP"
  const formatDate = (ts: number) => format(new Date(ts * 1000), "yyyy.MM.dd HH:mm:ss")

  const handleEscrowFinish = async (tx: EscrowTx, parentMemo: Memo) => {
    const cookies = document.cookie
    const match = cookies.match(/xrp_address=([^;]+)/)
    const userAddress = match ? decodeURIComponent(match[1]) : null
  
    if (!userAddress || !parentMemo.data?.userA || !parentMemo.data?.userB) {
      alert("🚨 Missing user address or contract info.")
      return
    }
  
    const role =
      userAddress === parentMemo.data.userA
        ? "userA"
        : userAddress === parentMemo.data.userB
          ? "userB"
          : null
  
    if (!role) {
      alert("🚫 You are not a participant in this contract.")
      return
    }
  
    const txJson = {
      TransactionType: "EscrowFinish",
      Account: userAddress,
      Owner: parentMemo.data.owner || parentMemo.data.userA,
      OfferSequence: tx.sequence,
    }
  
    console.log("📦 txJson to be signed:", txJson)
  
    const payloadRes = await fetch("/api/escrow/multisign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createPayload",
        txJson,
      }),
    })
  
    const { uuid, next, error } = await payloadRes.json()
    console.log("🧾 Payload creation response:", { uuid, next, error })
  
    if (!uuid || error) {
      alert("❌ Failed to create signing payload.")
      return
    }
  
    window.open(`https://xumm.app/sign/${uuid}`, "_blank")
  
    // 🔁 반복 풀링 로직 (최대 30초 동안, 1.5초마다 체크)
    const maxTries = 20
    let tryCount = 0
    let signed = false
  
    const pollSignature = async () => {
      tryCount++
      const res = await fetch("/api/escrow/multisign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "collectSignature",
          uuid,
        }),
      })
      const result = await res.json()
  
      if (result.success) {
        signed = true
        alert("✅ Signature collected!")
  
        // 🧾 자동 제출 (2명 이상일 때)
        if (result.collected >= 2) {
          const submitRes = await fetch("/api/escrow/multisign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "submitMultisigned",
              sequence: result.sequence,
            }),
          })
  
          const submitData = await submitRes.json()
          if (submitData.success) {
            alert("🚀 EscrowFinish transaction submitted successfully!")
          } else {
            alert("❌ Failed to submit transaction: " + submitData.error)
          }
        } else {
          alert("🕓 Waiting for another signature...")
        }
      } else if (tryCount < maxTries) {
        setTimeout(pollSignature, 1500)
      } else {
        alert("⌛️ Timed out waiting for signature.")
      }
    }
  
    pollSignature()
  }
  
  

  return (
    <div className="flex h-screen bg-white">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 font-sans">
          <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-black">Escrow Transactions</h1>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <Accordion type="multiple" className="w-full">
                {transactions.map((tx, idx) => {
                  const parentMemo = tx.memos.find((m) => m.type === "parent_contract")
                  const milestoneMemo = tx.memos.find((m) => m.type === "milestone")
                  return (
                    <AccordionItem key={idx} value={tx.hash}>
                      <AccordionTrigger className="text-left px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md hover:bg-zinc-700">
                        <div className="flex justify-between w-full text-sm font-medium">
                          <span>{tx.hash.slice(0, 12)}...</span>
                          <span className="text-gray-300">{formatXRP(tx.amount)} • {formatDate(tx.finishAfter)}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-zinc-800 border border-zinc-700 rounded-md p-4 mt-2 space-y-4 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><span className="text-gray-400">Destination:</span> {tx.destination}</div>
                          <div><span className="text-gray-400">Cancel After:</span> {formatDate(tx.cancelAfter)}</div>
                        </div>
                        {parentMemo?.data && (
                          <div className="pt-4 space-y-1">
                            <div className="text-lg font-semibold text-white">Contract Info</div>
                            <div>Title: <span className="text-gray-300">{parentMemo.data.contractTitle}</span></div>
                            <div>User A: <span className="text-gray-300">{parentMemo.data.userA}</span></div>
                            <div>User B: <span className="text-gray-300">{parentMemo.data.userB}</span></div>
                            <div>Description: <span className="text-gray-300">{parentMemo.data.description}</span></div>
                            <div>Total Amount: <span className="text-gray-300">{parentMemo.data.amount} XRP</span></div>
                          </div>
                        )}
                        {milestoneMemo?.data && (
                          <div className="pt-4 space-y-1">
                            <div className="text-lg font-semibold text-white">Milestone</div>
                            <div>Title: <span className="text-gray-300">{milestoneMemo.data.title}</span></div>
                            <div>Percentage: <span className="text-gray-300">{milestoneMemo.data.percentage}%</span></div>
                            <div>Status:{" "}
                              <span className={milestoneMemo.data.completed ? "text-green-400" : "text-red-400"}>
                                {milestoneMemo.data.completed ? "Completed" : "Not completed"}
                              </span>
                            </div>
                          </div>
                        )}
                        <Button
                          onClick={() => handleEscrowFinish(tx, parentMemo!)}
                          className="bg-blue-600 text-white px-4 py-2 mt-4 hover:bg-blue-700"
                        >
                          Submit Escrow Finish
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
