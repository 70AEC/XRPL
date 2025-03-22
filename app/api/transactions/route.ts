import { NextRequest, NextResponse } from "next/server"
import { Client, AccountTxRequest } from "xrpl"
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
    const txReq: AccountTxRequest = {
      command: "account_tx",
      account: address,
      ledger_index_min: -1,
      ledger_index_max: -1,
      limit: 50,
    }

    const response = await client.request(txReq)
    const allTxs = response.result.transactions

    const escrowTxs = allTxs.filter((tx: any) => {
      const transaction = tx.tx || tx.tx_json || tx
      return transaction.TransactionType === "EscrowCreate"
    })

    const decoded = escrowTxs.map((tx: any) => {
      const transaction = tx.tx || tx.tx_json || tx
      const memos = transaction.Memos?.map((m: any) => {
        const type = m.Memo.MemoType
          ? Buffer.from(m.Memo.MemoType, "hex").toString()
          : "memo"

        const rawData = m.Memo.MemoData
          ? Buffer.from(m.Memo.MemoData, "hex").toString()
          : ""

        let parsedData: any = rawData
        try {
          parsedData = JSON.parse(rawData)
        } catch {
          // Not JSON
        }

        return { type, data: parsedData }
      }) || []

      return {
        hash: transaction.hash || tx.hash,
        amount: typeof transaction.Amount === "string" ? transaction.Amount : transaction.Amount?.value || "0",
        destination: transaction.Destination || "N/A",
        finishAfter: transaction.FinishAfter || 0,
        cancelAfter: transaction.CancelAfter || 0,
        sequence: transaction.Sequence || 0,
        memos,
      }
    })
    //console.log("Decoded Escrow Transactions:", JSON.stringify(decoded, null, 2)) 
    await client.disconnect()
    return NextResponse.json({ escrows: decoded })
  } catch (err: any) {
    await client.disconnect()
    console.error("Failed to fetch transactions:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
