import { NextRequest, NextResponse } from 'next/server'
import { XummSdk } from 'xumm-sdk'

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
)

export async function POST(req: NextRequest) {
  const payload = await xumm.payload.create({
    TransactionType: 'SignIn',
    options: {
      return_url: {
        web: `${process.env.NEXT_PUBLIC_APP_URL}/xumm-redirect`
      }
    }
  })

  return NextResponse.json({
    uuid: payload?.uuid,
    next: payload?.next.always
  })
}
