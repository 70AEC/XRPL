import { NextRequest, NextResponse } from "next/server"
import { Client, Wallet, convertStringToHex, EscrowCreate } from "xrpl"

const XRPL_ENDPOINT = "wss://s.altnet.rippletest.net:51233" // ✅ WebSocket 기반 (Testnet)
const ADMIN_SECRET = process.env.XRPL_API_SECRET as string

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      contractTitle,
      partnerAddress,
      escrowAmount,
      description,
      escrowType,
      milestones,
      userA,
      userB,
    } = body

    if (!contractTitle || !partnerAddress || !escrowAmount || !Array.isArray(milestones)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = new Client(XRPL_ENDPOINT)
    await client.connect()

    const adminWallet = Wallet.fromSeed(ADMIN_SECRET)
    const totalXRP = parseFloat(escrowAmount)
    const timestamp = Date.now()

    const parentMemo = {
      userA,
      userB,
      admin: adminWallet.classicAddress,
      contractTitle,
      description,
      amount: totalXRP,
      milestones,
      createdAt: timestamp,
    }

    const results: any[] = []

    for (const milestone of milestones) {
      const { title, percentage } = milestone
      const milestoneDrops = Math.floor(totalXRP * 1000000 * (percentage / 100)).toString()

      const tx: EscrowCreate = {
        TransactionType: "EscrowCreate",
        Account: adminWallet.classicAddress,
        Destination: partnerAddress,
        Amount: milestoneDrops,
        CancelAfter: Math.floor(Date.now() / 1000) + 86400 * 30,
        FinishAfter: Math.floor(Date.now() / 1000) + 60,
        Memos: [
          {
            Memo: {
              MemoType: convertStringToHex("parent_contract"),
              MemoData: convertStringToHex(JSON.stringify(parentMemo)),
            },
          },
          {
            Memo: {
              MemoType: convertStringToHex("milestone"),
              MemoData: convertStringToHex(JSON.stringify({
                title,
                percentage,
                amount: milestoneDrops,
              })),
            },
          },
        ],
      }

      const prepared = await client.autofill(tx)
      const signed = adminWallet.sign(prepared)
      const submitted = await client.submitAndWait(signed.tx_blob)

      results.push(submitted.result)
    }

    await client.disconnect()

    return NextResponse.json({
      success: true,
      message: "Escrow contracts submitted",
      results,
    })
  } catch (error: any) {
    console.error("Error creating escrow:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}