// /app/api/escrow/create/route.ts
import { NextRequest, NextResponse } from "next/server"

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
    } = body

    if (!contractTitle || !partnerAddress || !escrowAmount || !Array.isArray(milestones)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 📌 여기서 스마트 컨트랙트 생성 로직이 들어갈 예정
    // 예: XRPL EscrowCreate 트랜잭션 호출

    

    return NextResponse.json({ success: true, message: "Escrow contract data received." })
  } catch (error) {
    console.error("Error creating escrow:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
