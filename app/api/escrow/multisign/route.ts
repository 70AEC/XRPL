import { NextRequest, NextResponse } from "next/server"
import { XummSdk } from "xumm-sdk"
import {
  Client,
  Wallet,
  SignerListSet,
  SubmitMultisignedRequest,
  Signer,
  decode,
} from "xrpl"

const xumm = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
)

const XRPL_ENDPOINT = "wss://s.altnet.rippletest.net:51233"
const ADMIN_SECRET = process.env.XRPL_ADMIN_SEED!
const adminWallet = Wallet.fromSeed(ADMIN_SECRET)

// In-memory storage for signatures
const signedBlobs: Record<number, Signer[]> = {}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const action = body.action

    switch (action) {
      case "setSignerList": {
        const { signerAccounts } = body
        if (!signerAccounts || !Array.isArray(signerAccounts)) {
          return NextResponse.json({ error: "Missing signer accounts" }, { status: 400 })
        }

        const signerListTx: SignerListSet = {
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

      case "createPayload": {
        const { txJson } = body
        if (!txJson) {
          return NextResponse.json({ error: "Missing txJson" }, { status: 400 })
        }

        const payload = await xumm.payload.createAndSubscribe(
          {
            txjson: txJson,
            options: { multisign: true },
          },
          event => event.data.signed === true
        )

        return NextResponse.json({
          success: true,
          uuid: payload.created.uuid,
          next: payload.created.next.always,
        })
      }

      case "collectSignature": {
        const { uuid } = body
        const payload = await xumm.payload.get(uuid)
        if (!payload) {
          return NextResponse.json({ error: "Payload not found" }, { status: 400 })
        }
        const hex = payload.response.hex
        const signerAddress = payload.response.account

        if (!hex || !signerAddress) {
          return NextResponse.json({ error: "Not signed yet" }, { status: 400 })
        }

        const decoded = decode(hex) as any
        const sequence = decoded.Sequence || decoded.OfferSequence
        if (!sequence) {
          return NextResponse.json({ error: "No sequence found in tx" }, { status: 400 })
        }

        const signerEntry: Signer = {
          Signer: {
            Account: signerAddress,
            SigningPubKey: decoded.SigningPubKey,
            TxnSignature: decoded.TxnSignature,
          },
        }

        if (!signedBlobs[sequence]) signedBlobs[sequence] = []
        signedBlobs[sequence].push(signerEntry)

        return NextResponse.json({
          success: true,
          sequence,
          collected: signedBlobs[sequence].length,
        })
      }

      case "submitMultisigned": {
        const { sequence, txJson } = body
        if (!sequence || !signedBlobs[sequence]) {
          return NextResponse.json({ error: "No signatures found" }, { status: 400 })
        }

        const tx: SubmitMultisignedRequest = {
          ...txJson,
          Signers: signedBlobs[sequence],
        }

        const client = new Client(XRPL_ENDPOINT)
        await client.connect()
        
        const result = await client.submit({
            TransactionType: "EscrowFinish",
            Account: userA,
            Owner: userA,
            OfferSequence: offerSequence,
            Signers: [userASigner, userBSigner], // 각 서명자의 Signer 객체
          }, {
            autofill: false,
            failHard: true,
          })
          
        await client.disconnect()

        return NextResponse.json({ success: true, result })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (err: any) {
    console.error("🔴 Multisign Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
