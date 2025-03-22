// /app/api/escrow/create/route.ts
import { NextRequest, NextResponse } from "next/server"
import { XummSdk } from "xumm-sdk"
import { Wallet } from "xrpl"

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
)

const ADMIN_SECRET = process.env.XRPL_ADMIN_SEED as string
const adminWallet = Wallet.fromSeed(ADMIN_SECRET)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      contractTitle,
      partnerAddress,
      escrowAmount,
      description,
      escrowType,
      milestones,
      userA,
      userB,
    } = body

    if (!contractTitle || !partnerAddress || !escrowAmount || !Array.isArray(milestones)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const totalXRP = parseFloat(escrowAmount)
    const timestamp = Date.now()

    const parentMemo = {
      userA,
      userB,
      admin: adminWallet.classicAddress,
      contractTitle,
      description,
      amount: totalXRP,
      milestones,
      createdAt: timestamp,
    }

    const payloads = []

    for (const milestone of milestones) {
      const milestoneAmount = Math.floor(totalXRP * 1000000 * (milestone.percentage / 100)).toString()

      const payload = await xumm.payload.create({
        txjson: {
          TransactionType: "EscrowCreate",
          Account: userA,
          Destination: partnerAddress,
          Amount: milestoneAmount,
          CancelAfter: Math.floor(Date.now() / 1000) + 86400 * 30,
          FinishAfter: Math.floor(Date.now() / 1000) + 60,
          Memos: [
            {
              Memo: {
                MemoType: Buffer.from("parent_contract").toString("hex"),
                MemoData: Buffer.from(JSON.stringify(parentMemo)).toString("hex"),
              },
            },
            {
              Memo: {
                MemoType: Buffer.from("milestone").toString("hex"),
                MemoData: Buffer.from(JSON.stringify(milestone)).toString("hex"),
              },
            },
          ],
        },
        options: {
          return_url: {
            web: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          },
        },
      })

      if (payload) {
        payloads.push({ uuid: payload.uuid, next: payload.next.always })
      } else {
        console.error("Payload creation failed and returned null.")
      }
    }

    return NextResponse.json({ success: true, payloads })
  } catch (error: any) {
    console.error("Error creating escrow via XUMM:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
