import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ success: false, error: "Missing address" }, { status: 400 })
  }

  try {
    const res = await fetch(`https://s.altnet.rippletest.net:51234`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "account_info",
        params: [{ account: address, ledger_index: "validated" }],
      }),
    })

    const result = await res.json()

    const balance = result.result?.account_data?.Balance

    return NextResponse.json({
      success: true,
      balance,
    })
  } catch (error) {
    console.error("XRPL balance error:", error)
    return NextResponse.json({
      success: false,
      error: (error as Error).message || "Unknown error",
    }, { status: 500 })
  }
}
