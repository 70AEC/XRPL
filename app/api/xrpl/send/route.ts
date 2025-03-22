import { NextRequest, NextResponse } from "next/server"
import { XummSdk } from "xumm-sdk"

const xumm = new XummSdk(process.env.NEXT_PUBLIC_XUMM_API_KEY!, process.env.XUMM_API_SECRET!)

export async function POST(req: NextRequest) {
  const { from, to, amount } = await req.json()

  const tx: {
    TransactionType: "Payment"
    Account: string
    Destination: string
    Amount: string
  } = {
    TransactionType: "Payment",
    Account: from,
    Destination: to,
    Amount: (parseFloat(amount) * 1_000_000).toFixed(0),
  }

  try {
    const payload = await xumm.payload.create(tx, true)

    return NextResponse.json({
      uuid: payload?.uuid,
      next: payload?.next.always,
    })
  } catch (err) {
    console.error("❌ XUMM payload error:", err)
    return NextResponse.json({ error: "XUMM payload creation failed" }, { status: 500 })
  }
}
