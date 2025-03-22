import { NextResponse } from "next/server"
import { XummSdk } from "xumm-sdk"
import { Client, Wallet, SignerListSet, decode } from "xrpl"

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY,
  process.env.XUMM_API_SECRET
)

const XRPL_ENDPOINT = "wss://s.altnet.rippletest.net:51233"
const ADMIN_SECRET = process.env.XRPL_ADMIN_SEED
const adminWallet = Wallet.fromSeed(ADMIN_SECRET)

const signedTxStore = {}
let txJsonStore = {}

export async function POST(req) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === "setSignerList") {
      const { signerAccounts } = body
      if (!signerAccounts || !Array.isArray(signerAccounts)) {
        return NextResponse.json({ error: "Missing signer accounts" }, { status: 400 })
      }

      const signerListTx = {
        TransactionType: "SignerListSet",
        Account: adminWallet.classicAddress,
        SignerQuorum: signerAccounts.length,
        SignerEntries: signerAccounts.map(account => ({
          SignerEntry: { Account: account, SignerWeight: 1 },
        })),
      }

      const client = new Client(XRPL_ENDPOINT)
      await client.connect()
      const prepared = await client.autofill(signerListTx)
      const signed = adminWallet.sign(prepared)
      const result = await client.submitAndWait(signed.tx_blob)
      await client.disconnect()

      return NextResponse.json({ success: true, result })
    }

    if (action === "createPayload") {
      const { txJson } = body
      if (!txJson) {
        return NextResponse.json({ error: "Missing txJson" }, { status: 400 })
      }

      console.log("📦 Received txJson", txJson)

      const client = new Client(XRPL_ENDPOINT)
      await client.connect()
      const autofilled = await client.autofill(txJson)
      await client.disconnect()

      console.log("🧩 Autofilled txJson", autofilled)

      const multisignTx = {
        ...autofilled,
        SigningPubKey: "",
      }

      console.log("🚀 Sending to XUMM payload.create:", multisignTx)

      const payload = await xumm.payload.create({
        txjson: multisignTx,
        options: { multisign: true },
      })

      if (!payload || !payload.uuid || !payload.next?.always) {
        console.error("❌ Payload creation returned invalid response:", payload)
        return NextResponse.json({ error: "Invalid payload response from XUMM" }, { status: 500 })
      }

      const sequence = multisignTx.Sequence || multisignTx.OfferSequence
      if (sequence) txJsonStore[sequence] = multisignTx

      return NextResponse.json({
        success: true,
        uuid: payload.uuid,
        next: payload.next.always,
      })
    }

    if (action === "collectSignature") {
      const { uuid } = body
      if (!uuid) {
        return NextResponse.json({ error: "Missing payload UUID" }, { status: 400 })
      }

      const maxRetries = 10
      const intervalMs = 1500
      let payload = null

      for (let i = 0; i < maxRetries; i++) {
        const fetched = await xumm.payload.get(uuid)
        if (fetched?.meta?.signed) {
          payload = fetched
          break
        }
        await new Promise(resolve => setTimeout(resolve, intervalMs))
      }

      if (!payload?.response?.hex || !payload?.response?.account) {
        return NextResponse.json({ error: "Payload not signed or not found." }, { status: 400 })
      }

      const hex = payload.response.hex
      const signerAddress = payload.response.account

      const decoded = decode(hex)
      const sequence = decoded.Sequence || decoded.OfferSequence
      if (!sequence) {
        return NextResponse.json({ error: "No sequence found in tx" }, { status: 400 })
      }

      const signerEntry = {
        Signer: {
          Account: signerAddress,
          SigningPubKey: decoded.SigningPubKey,
          TxnSignature: decoded.TxnSignature,
        },
      }

      if (!signedTxStore[sequence]) signedTxStore[sequence] = []
      signedTxStore[sequence].push(signerEntry)

      return NextResponse.json({
        success: true,
        sequence,
        collected: signedTxStore[sequence].length,
      })
    }

    if (action === "submitMultisigned") {
      const { sequence } = body
      const signers = signedTxStore[sequence]
      const txJson = txJsonStore[sequence]

      if (!sequence || !signers || !txJson) {
        return NextResponse.json({ error: "Missing required data" }, { status: 400 })
      }

      const multisignedTx = {
        ...txJson,
        Signers: signers,
      }

      const client = new Client(XRPL_ENDPOINT)
      await client.connect()
      const result = await client.submit(multisignedTx)
      await client.disconnect()

      return NextResponse.json({ success: true, result })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (err) {
    console.error("🔥 Multisign Route Error:", err)
    return NextResponse.json({ success: false, error: err.message || "Unknown error" }, { status: 500 })
  }
}
