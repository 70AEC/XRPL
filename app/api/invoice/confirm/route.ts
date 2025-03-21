import { type NextRequest, NextResponse } from "next/server"
import { finishEscrow, connectWallet } from "@/lib/xrpl-client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { invoiceId, escrowId, seed, owner, offerSequence, fulfillment } = body

    // Validate required fields
    if (!invoiceId || !escrowId || !seed || !owner || !offerSequence) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Here you would typically verify the invoice in your database
    // For demo purposes, we'll assume the invoice is valid

    // Connect wallet
    const walletResult = await connectWallet(seed)
    if (!walletResult.success) {
      return NextResponse.json({ error: "Failed to connect wallet", details: walletResult.error }, { status: 500 })
    }

    // Finish escrow to release payment
    const escrowResult = await finishEscrow(walletResult.wallet, owner, offerSequence, fulfillment)

    if (!escrowResult.success) {
      return NextResponse.json({ error: "Failed to finish escrow", details: escrowResult.error }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Invoice confirmed and payment released",
      transaction: escrowResult.result,
    })
  } catch (error) {
    console.error("Error in invoice confirmation API:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}

