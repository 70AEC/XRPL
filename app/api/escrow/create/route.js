import { NextResponse } from "next/server"
import { XummSdk } from "xumm-sdk"
import { Wallet } from "xrpl"

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY,
  process.env.XUMM_API_SECRET
)

const ADMIN_SECRET = process.env.XRPL_ADMIN_SEED
const adminWallet = Wallet.fromSeed(ADMIN_SECRET)

export async function POST(req) {
  try {
    const {
      contractTitle,
      partnerAddress,
      escrowAmount,
      description,
      escrowType,
      milestones,
      userA,
      userB,
    } = await req.json()

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
      const milestoneAmount = Math.floor(totalXRP * 1_000_000 * (milestone.percentage / 100)).toString()

      console.log(`📦 Creating payload for: ${milestone.title}`)
      console.log("→ amount:", milestoneAmount)

      try {
        const payload = await xumm.payload.create({
          txjson: {
            TransactionType: "EscrowCreate",
            Account: userA,
            Destination: partnerAddress,
            Amount: milestoneAmount,
            CancelAfter: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30일 후
            FinishAfter: Math.floor(Date.now() / 1000) + 60, // 1분 후
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
            submit: false, // ❗️유저 서명이 필요하므로 직접 전송 ❌
            return_url: {
              web: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            },
          },
        })

        if (payload?.uuid) {
          console.log("✅ Payload created:", payload.uuid)
          payloads.push({ uuid: payload.uuid, next: payload.next.always })
        } else {
          console.warn("❌ No payload returned for:", milestone.title)
        }
      } catch (err) {
        console.error(`🚨 Failed to create XUMM payload for "${milestone.title}":`, err.message)
      }

      await new Promise((res) => setTimeout(res, 3000)) // Delay between payloads
    }

    return NextResponse.json({ success: true, payloads })
  } catch (err) {
    console.error("🚨 Escrow creation failed:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
