import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { XummSdk } from 'xumm-sdk'
import { serialize } from 'cookie'

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const uuid = searchParams.get('uuid')

  if (!uuid) {
    return NextResponse.json({ error: 'Missing uuid' }, { status: 400 })
  }
  
  const payload = await xumm.payload.get(uuid as string)
  

  if (payload?.meta.signed === true) {
    const address = payload.response.account

    // ✅ 세션 쿠키 발급
    const response = NextResponse.json({ success: true, address })

    response.headers.set(
      'Set-Cookie',
      serialize('session', address ?? '', {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1일
      })
    )

    return response
  }

  return NextResponse.json({ success: false })
}
