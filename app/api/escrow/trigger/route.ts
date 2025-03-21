import { type NextRequest, NextResponse } from "next/server"
import { finishEscrow, connectWallet, getAccountEscrows } from "@/lib/xrpl-client"

// This API endpoint is designed to be called by a scheduled job
// to automatically finish escrows that have met their conditions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { seed, address } = body

    // Validate required fields
    if (!seed || !address) {
      return NextResponse.json({ error: "Missing required fields: seed and address are required" }, { status: 400 })
    }

    // Connect wallet
    const walletResult = await connectWallet(seed)
    if (!walletResult.success) {
      return NextResponse.json({ error: "Failed to connect wallet", details: walletResult.error }, { status: 500 })
    }

    // Get all escrows for the account
    const escrowsResult = await getAccountEscrows(address)
    if (!escrowsResult.success) {
      return NextResponse.json(
        { error: "Failed to get account escrows", details: escrowsResult.error },
        { status: 500 },
      )
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const results = []

    // Process each escrow
    for (const escrow of escrowsResult.escrows) {
      // Check if escrow is eligible for automatic finish
      // For time-based escrows, check if FinishAfter has passed
      if (escrow.FinishAfter && escrow.FinishAfter <= currentTime) {
        const finishResult = await finishEscrow(walletResult.wallet, escrow.Account, escrow.Sequence)

        results.push({
          escrow: escrow.Sequence,
          success: finishResult.success,
          result: finishResult.success ? finishResult.result : finishResult.error,
        })
      }
    }

    // Return success response with results
    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error("Error in escrow trigger API:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}

