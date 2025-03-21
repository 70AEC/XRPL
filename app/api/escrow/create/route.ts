import { type NextRequest, NextResponse } from "next/server"
import { createEscrow, connectWallet } from "@/lib/xrpl-client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { seed, destination, amount, finishAfter, cancelAfter, condition } = body

    // Validate required fields
    if (!seed || !destination || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: seed, destination, and amount are required" },
        { status: 400 },
      )
    }

    // Connect wallet
    const walletResult = await connectWallet(seed)
    if (!walletResult.success) {
      return NextResponse.json({ error: "Failed to connect wallet", details: walletResult.error }, { status: 500 })
    }

    // Create escrow
    const escrowResult = await createEscrow(
      walletResult.wallet,
      destination,
      amount,
      finishAfter,
      cancelAfter,
      condition,
    )

    if (!escrowResult.success) {
      return NextResponse.json({ error: "Failed to create escrow", details: escrowResult.error }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({
      success: true,
      transaction: escrowResult.result,
      escrowId: `ESC-${Date.now().toString().slice(-6)}`,
    })
  } catch (error) {
    console.error("Error in escrow creation API:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}

