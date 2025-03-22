import { NextRequest, NextResponse } from "next/server"
import { XummSdk } from "xumm-sdk"

const xumm = new XummSdk(process.env.NEXT_PUBLIC_XUMM_API_KEY!, process.env.XUMM_API_SECRET!)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const uuid = searchParams.get("uuid")

  if (!uuid) {
    return NextResponse.json({ error: "Missing uuid" }, { status: 400 })
  }

  try {
    const payload = await xumm.payload.get(uuid)

    if (!payload || !payload.meta) {
      return NextResponse.json({ success: false, message: "Payload not found" })
    }

    const signed = payload.meta.signed === true
    const txid = payload.response.txid || null

    return NextResponse.json({
      success: true,
      signed,
      txid,
      userToken: payload.application?.issued_user_token || null,
    })
  } catch (error) {
    console.error("❌ XUMM status check error:", error)
    return NextResponse.json({ error: "Failed to get payload status" }, { status: 500 })
  }
}
