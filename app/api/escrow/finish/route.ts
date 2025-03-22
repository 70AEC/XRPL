import { NextRequest, NextResponse } from "next/server"
import { XummSdk } from "xumm-sdk"
import { Client, Wallet } from "xrpl"

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
)

const XRPL_ENDPOINT = "wss://s.altnet.rippletest.net:51233"
const ADMIN_SECRET = process.env.XRPL_ADMIN_SEED!
const adminWallet = Wallet.fromSeed(ADMIN_SECRET)

// In-memory cache (use DB in production)
const signedTxStore: Record<number, { userA?: string; userB?: string }> = {}

export async function POST(req: NextRequest) {
  try {
    const {
      offerSequence,
      role,
      userA,
      userB,
    }: { offerSequence: number; role: "userA" | "userB"; userA: string; userB: string } = await req.json()

    if (!offerSequence || !role || !userA || !userB) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Manually retrieve recent payloads (no history() in SDK)
    const payloadRes = await fetch("https://xumm.app/api/v1/platform/payloads", {
      headers: {
        "X-API-Key": process.env.NEXT_PUBLIC_XUMM_API_KEY!,
        "X-API-Secret": process.env.XUMM_API_SECRET!,
      },
    })

    const payloads = await payloadRes.json()
    const matchedPayload = Array.isArray(payloads?.payloads)
      ? payloads.payloads.find((p: any) => {
          const tx = p?.request?.json
          return (
            tx?.TransactionType === "EscrowFinish" &&
            tx?.OfferSequence === offerSequence &&
            tx?.Account === (role === "userA" ? userA : userB)
          )
        })
      : undefined

    if (!matchedPayload?.uuid) {
      return NextResponse.json({ error: "Matching signed payload not found." }, { status: 404 })
    }

    const payload = await xumm.payload.get(matchedPayload.uuid)
    const txBlob = payload?.response?.hex
    const signer = payload?.response?.account

    if (!txBlob || !signer) {
      return NextResponse.json({ error: "Transaction not signed yet" }, { status: 400 })
    }

    const expectedAddress = role === "userA" ? userA : userB
    if (signer !== expectedAddress) {
      return NextResponse.json({
        error: `Signer mismatch: expected ${expectedAddress}, got ${signer}`,
      }, { status: 400 })
    }

    if (!signedTxStore[offerSequence]) signedTxStore[offerSequence] = {}
    signedTxStore[offerSequence][role] = txBlob

    const bothSigned = signedTxStore[offerSequence].userA && signedTxStore[offerSequence].userB

    if (bothSigned) {
      const client = new Client(XRPL_ENDPOINT)
      await client.connect()

      const multisigned = signedTxStore[offerSequence].userA! + signedTxStore[offerSequence].userB!.slice(8)
      const result = await client.submit(multisigned, { failHard: true })

      await client.disconnect()

      return NextResponse.json({
        success: true,
        result,
        submittedBy: {
          userA,
          userB,
          admin: adminWallet.classicAddress,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: `Signed by ${role}. Waiting for ${role === "userA" ? "userB" : "userA"}.`,
    })
  } catch (error: any) {
    console.error("❌ EscrowFinish error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
