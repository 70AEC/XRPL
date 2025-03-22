// /app/api/transactions/latest/route.js

import { NextResponse } from "next/server"
import { Client } from "xrpl"
import { cookies } from "next/headers"

const XRPL_ENDPOINT = "wss://s.altnet.rippletest.net:51233"

export async function GET() {
  const cookieStore = cookies()
  const session = (await cookieStore).get("session")

  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const address = session.value
  const client = new Client(XRPL_ENDPOINT)
  await client.connect()

  try {
    const response = await client.request({
      command: "account_tx",
      account: address,
      ledger_index_min: -1,
      ledger_index_max: -1,
      limit: 20,
    })

    const allTxs = response.result.transactions
    const escrowTxs = allTxs.filter((tx) => {
      const transaction = tx.tx || tx.tx_json || tx
      return transaction.TransactionType === "EscrowCreate"
    })

    const latest = escrowTxs[0]
    if (!latest) {
      await client.disconnect()
      return NextResponse.json({ error: "No escrow transactions found" }, { status: 404 })
    }

    const tx = latest.tx || latest.tx_json || latest
    const memos = (tx.Memos || []).map((m) => {
      const type = m.Memo.MemoType
        ? Buffer.from(m.Memo.MemoType, "hex").toString()
        : "memo"
      const rawData = m.Memo.MemoData
        ? Buffer.from(m.Memo.MemoData, "hex").toString()
        : ""

      let parsedData = rawData
      try {
        parsedData = JSON.parse(rawData)
      } catch (_) {}

      return { type, data: parsedData }
    })

    const result = {
      hash: tx.hash,
      amount: typeof tx.Amount === "string" ? tx.Amount : tx.Amount?.value || "0",
      destination: tx.Destination || "N/A",
      finishAfter: tx.FinishAfter || 0,
      cancelAfter: tx.CancelAfter || 0,
      sequence: tx.Sequence || 0,
      memos,
    }

    await client.disconnect()
    return NextResponse.json({ escrow: result })
  } catch (err) {
    await client.disconnect()
    console.error("❌ Error fetching latest escrow:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
