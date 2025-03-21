import { type NextRequest, NextResponse } from "next/server"
import { cancelEscrow, connectWallet } from "@/lib/xrpl-client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { seed, owner, offerSequence } = body

    // Validate required fields
    if (!seed || !owner || !offerSequence) {
      return NextResponse.json(
        { error: "Missing required fields: seed, owner, and offerSequence are required" },
        { status: 400 },
      )
    }

    // Connect wallet
    const walletResult = await connectWallet(seed)
    if (!walletResult.success) {
      return NextResponse.json({ error: "Failed to connect wallet", details: walletResult.error }, { status: 500 })
    }

    // Cancel escrow
    const escrowResult = await cancelEscrow(walletResult.wallet, owner, offerSequence)

    if (!escrowResult.success) {
      return NextResponse.json({ error: "Failed to cancel escrow", details: escrowResult.error }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({
      success: true,
      transaction: escrowResult.result,
    })
  } catch (error) {
    console.error("Error in escrow cancel API:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}

