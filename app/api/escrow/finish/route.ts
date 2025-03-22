// /app/api/escrow/finish/route.ts
import { NextRequest, NextResponse } from "next/server"
import { XummSdk } from "xumm-sdk"
import { Client, Wallet } from "xrpl"

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
)

const XRPL_ENDPOINT = "wss://s.altnet.rippletest.net:51233"
const ADMIN_SECRET = process.env.XRPL_ADMIN_SEED as string
const adminWallet = Wallet.fromSeed(ADMIN_SECRET)

// Simple in-memory store (replace with DB in production)
const signedTxStore: Record<number, { userA?: string; userB?: string }> = {}

export async function POST(req: NextRequest) {
  try {
    const {
      offerSequence,
      role,
      userA,
      userB,
    }: { offerSequence: number; role: 'userA' | 'userB'; userA: string; userB: string } = await req.json()

    if (!offerSequence || !role || !userA || !userB) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const payloads = await xumm.payload.get('')

    const matchedPayload = Array.isArray(payloads?.payload) ? payloads.payload.find(p => {
      const tx = p?.request?.json
      return (
        tx?.TransactionType === "EscrowFinish" &&
        tx?.OfferSequence === offerSequence &&
        tx?.Account === (role === 'userA' ? userA : userB)
      )
    }) : undefined

    if (!matchedPayload || !matchedPayload.uuid) {
      return NextResponse.json({ error: "Matching signed payload not found." }, { status: 404 })
    }

    const payload = await xumm.payload.get(matchedPayload.uuid)
    const txBlob = payload?.response?.hex
    const signer = payload?.response?.account

    if (!txBlob || !signer) {
      return NextResponse.json({ error: "Transaction not signed yet" }, { status: 400 })
    }

    const expectedAddress = role === 'userA' ? userA : userB
    if (signer !== expectedAddress) {
      return NextResponse.json({ error: `Signer does not match selected role: expected ${expectedAddress}` }, { status: 400 })
    }

    // Store the signed tx_blob
    if (!signedTxStore[offerSequence]) {
      signedTxStore[offerSequence] = {}
    }
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
      message: `Waiting for ${role === 'userA' ? 'userB' : 'userA'} to sign.`,
    })
  } catch (error: any) {
    console.error("Error handling EscrowFinish flow:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}