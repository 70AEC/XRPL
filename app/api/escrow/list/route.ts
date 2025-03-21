import { type NextRequest, NextResponse } from "next/server"
import { getAccountEscrows } from "@/lib/xrpl-client"

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address")

    // Validate required fields
    if (!address) {
      return NextResponse.json({ error: "Missing required parameter: address" }, { status: 400 })
    }

    // Get account escrows
    const escrowResult = await getAccountEscrows(address)

    if (!escrowResult.success) {
      return NextResponse.json({ error: "Failed to get account escrows", details: escrowResult.error }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({
      success: true,
      escrows: escrowResult.escrows,
    })
  } catch (error) {
    console.error("Error in escrow list API:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}

