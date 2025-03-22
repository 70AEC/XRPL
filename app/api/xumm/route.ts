import { NextRequest, NextResponse } from 'next/server'
import { XummSdk } from 'xumm-sdk'

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
)

export async function POST(req: NextRequest) {
  const payload = await xumm.payload.create({
    TransactionType: "SignIn"
  })

  return NextResponse.json({ next: payload?.next.always })
}
