// /app/api/escrow/cancel/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Client, Wallet, EscrowCancel } from "xrpl"

const XRPL_ENDPOINT = "wss://s.altnet.rippletest.net:51233" // ✅ WebSocket 기반 (Testnet)
const ADMIN_SECRET = process.env.XUMM_API_SECRET as string

export async function POST(req: NextRequest) {
  try {
    const { owner, offerSequence } = await req.json()

    if (!owner || !offerSequence) {
      return NextResponse.json({ error: "Missing owner or offerSequence" }, { status: 400 })
    }

    const client = new Client(XRPL_ENDPOINT)
    await client.connect()

    const adminWallet = Wallet.fromSeed(ADMIN_SECRET)

    const cancelTx: EscrowCancel = {
      TransactionType: "EscrowCancel",
      Account: adminWallet.classicAddress,
      Owner: owner,
      OfferSequence: offerSequence,
    }

    const prepared = await client.autofill(cancelTx)
    const signed = adminWallet.sign(prepared)
    const submitted = await client.submitAndWait(signed.tx_blob)

    await client.disconnect()

    const txResult = submitted.result.meta && typeof submitted.result.meta !== "string"
      ? submitted.result.meta.TransactionResult
      : "UNKNOWN"

    return NextResponse.json({
      success: true,
      txHash: submitted.result.hash,
      result: txResult,
    })
  } catch (error: any) {
    console.error("Error cancelling escrow:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
