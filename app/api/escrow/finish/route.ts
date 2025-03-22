// /app/api/escrow/finish/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Client, Wallet, EscrowFinish } from "xrpl"

const XRPL_ENDPOINT = "wss://s.altnet.rippletest.net:51233" // ✅ WebSocket 기반 (Testnet)
const ADMIN_SECRET = process.env.XRPL_ADMIN_SEED as string

export async function POST(req: NextRequest) {
  try {
    const { owner, offerSequence } = await req.json()

    if (!owner || !offerSequence) {
      return NextResponse.json({ error: "Missing owner or offerSequence" }, { status: 400 })
    }

    const client = new Client(XRPL_ENDPOINT)
    await client.connect()

    const adminWallet = Wallet.fromSeed(ADMIN_SECRET)

    const finishTx: EscrowFinish = {
      TransactionType: "EscrowFinish",
      Account: adminWallet.classicAddress,
      Owner: owner,
      OfferSequence: offerSequence,
    }

    const prepared = await client.autofill(finishTx)
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
    console.error("Error finishing escrow:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
