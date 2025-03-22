import { NextRequest, NextResponse } from "next/server"
import { XummSdk } from "xumm-sdk"

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
)

export async function POST(req: NextRequest) {
  try {
    const { offerSequence, userAddress, ownerAddress } = await req.json()

    if (!offerSequence || !userAddress || !ownerAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const payload = await xumm.payload.create({
      TransactionType: "EscrowFinish",
      Account: userAddress,
      Owner: ownerAddress,
      OfferSequence: offerSequence,
      SigningPubKey: "", // Required for multisign
    })

    if (!payload) {
      return NextResponse.json({ error: "Failed to create payload" }, { status: 500 })
    }

    return NextResponse.json({
      uuid: payload.uuid,
      next: payload.next,
    })
  } catch (err: any) {
    console.error("Error creating XUMM payload:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
