export const runtime = "nodejs"

import { getUsersCollection } from "@/lib/couchbase-utils"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const cookieStore = await cookies()
  const walletAddress = cookieStore.get("session")?.value

  if (!walletAddress) {
    return NextResponse.json({ error: "No wallet address" }, { status: 401 })
  }

  try {
    const collection = await getUsersCollection()
    const docId = `user::${walletAddress}`
    const userDoc = {
      walletAddress,
      kybVerified: false,
      type: "user",
      createdAt: new Date().toISOString(),
    }

    try {
      await collection.insert(docId, userDoc)
    } catch (error) {
      if (!error.message.includes("document exists")) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Insert error:", error)
    return NextResponse.json({ error: "Insert failed", detail: error.message }, { status: 500 })
  }
}
