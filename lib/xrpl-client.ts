// Using a more browser-compatible approach for XRPL interactions
import { XRPLClient } from "@/lib/xrpl-browser"

// Interface for EscrowCreateTransaction to include optional fields
interface EscrowCreateTransaction {
  TransactionType: "EscrowCreate";
  Account: string;
  Destination: string;
  Amount: string;
  FinishAfter?: number;
  CancelAfter?: number;
  Condition?: string;
}

interface EscrowFinishTransaction {
  TransactionType: "EscrowFinish";
  Account: string;
  Owner: string;
  OfferSequence: number;
  Fulfillment?: string; // Optional field for Fulfillment
}
// Initialize XRPL client
let client: XRPLClient | null = null

// Connect to XRPL
export async function connectToXRPL(server = "wss://s.altnet.rippletest.net:51233") {
  if (!client) {
    client = new XRPLClient(server)
    await client.connect()
    console.log("Connected to XRPL")
  }
  return client
}

// Disconnect from XRPL
export async function disconnectFromXRPL() {
  if (client) {
    await client.disconnect()
    console.log("Disconnected from XRPL")
    client = null
  }
}

// Create a new escrow
export async function createEscrow(
  wallet: any,
  destination: string,
  amount: string,
  finishAfter?: number,
  cancelAfter?: number,
  condition?: string,
) {
  try {
    const xrplClient = await connectToXRPL()

    const escrowCreate: EscrowCreateTransaction = {
      TransactionType: "EscrowCreate",
      Account: wallet.address,
      Destination: destination,
      Amount: amount,
    }

    // Add optional fields if provided
    if (finishAfter) {
      escrowCreate.FinishAfter = finishAfter
    }

    if (cancelAfter) {
      escrowCreate.CancelAfter = cancelAfter
    }

    if (condition) {
      escrowCreate.Condition = condition
    }

    // Submit the transaction
    const result = await xrplClient.submitTransaction(escrowCreate, wallet)

    return {
      success: true,
      result,
    }
  } catch (error) {
    console.error("Error creating escrow:", error)
    return {
      success: false,
      error,
    }
  }
}

// Finish an escrow
export async function finishEscrow(wallet: any, owner: string, offerSequence: number, fulfillment?: string) {
  try {
    const xrplClient = await connectToXRPL()

    const escrowFinish: EscrowFinishTransaction = {
      TransactionType: "EscrowFinish",
      Account: wallet.address,
      Owner: owner,
      OfferSequence: offerSequence,
    }

    // Add Fulfillment if provided
    if (fulfillment) {
      escrowFinish.Fulfillment = fulfillment
    }

    // Submit the transaction
    const result = await xrplClient.submitTransaction(escrowFinish, wallet)

    return {
      success: true,
      result,
    }
  } catch (error) {
    console.error("Error finishing escrow:", error)
    return {
      success: false,
      error,
    }
  }
}

// Cancel an escrow
export async function cancelEscrow(wallet: any, owner: string, offerSequence: number) {
  try {
    const xrplClient = await connectToXRPL()

    const escrowCancel = {
      TransactionType: "EscrowCancel",
      Account: wallet.address,
      Owner: owner,
      OfferSequence: offerSequence,
    }

    // Submit the transaction
    const result = await xrplClient.submitTransaction(escrowCancel, wallet)

    return {
      success: true,
      result,
    }
  } catch (error) {
    console.error("Error canceling escrow:", error)
    return {
      success: false,
      error,
    }
  }
}

// Get account escrows
export async function getAccountEscrows(address: string) {
  try {
    const xrplClient = await connectToXRPL()

    const result = await xrplClient.request({
      command: "account_objects",
      account: address,
      type: "escrow",
    })

    return {
      success: true,
      escrows: result.account_objects || [],
    }
  } catch (error) {
    console.error("Error getting account escrows:", error)
    return {
      success: false,
      error,
    }
  }
}

// Get transaction details
export async function getTransaction(txHash: string) {
  try {
    const xrplClient = await connectToXRPL()

    const result = await xrplClient.request({
      command: "tx",
      transaction: txHash,
    })

    return {
      success: true,
      transaction: result,
    }
  } catch (error) {
    console.error("Error getting transaction:", error)
    return {
      success: false,
      error,
    }
  }
}

// Connect wallet
export async function connectWallet(seed?: string) {
  try {
    const xrplClient = await connectToXRPL()

    let wallet

    if (seed) {
      // Use provided seed
      wallet = xrplClient.createWalletFromSeed(seed)
    } else {
      // Generate a new wallet
      wallet = xrplClient.generateWallet()
    }

    return {
      success: true,
      wallet,
    }
  } catch (error) {
    console.error("Error connecting wallet:", error)
    return {
      success: false,
      error,
    }
  }
}
