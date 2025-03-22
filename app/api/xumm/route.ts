// app/api/xumm/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { XummSdk } from 'xumm-sdk'

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY,
  process.env.XUMM_API_SECRET
)

export async function POST(req: NextRequest) {
  try {
    const payload = await xumm.payload.create({
      TransactionType: 'SignIn',
    })

    if (!payload) {
      return NextResponse.json({ error: 'XUMM payload creation failed' }, { status: 500 })
    }

    return NextResponse.json({ next: payload.next.always })
  } catch (error) {
    console.error('XUMM login error:', error)
    return NextResponse.json({ error: 'XUMM login failed' }, { status: 500 })
  }
}
