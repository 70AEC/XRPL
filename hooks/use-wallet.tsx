"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { connectToXRPL, disconnectFromXRPL, connectWallet } from "@/lib/xrpl-client"

interface Wallet {
  address: string
  seed: string
  publicKey?: string
  privateKey?: string
}

interface WalletContextType {
  wallet: Wallet | null
  isConnecting: boolean
  isConnected: boolean
  connect: (seed?: string) => Promise<void>
  disconnect: () => void
  error: string | null
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  error: null,
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize XRPL client
  useEffect(() => {
    const initClient = async () => {
      try {
        await connectToXRPL()
      } catch (err) {
        setError("Failed to connect to XRPL")
        console.error("XRPL connection error:", err)
      }
    }

    initClient()

    return () => {
      disconnectFromXRPL()
    }
  }, [])

  // Connect wallet
  const connect = async (seed?: string) => {
    setIsConnecting(true)
    setError(null)

    try {
      const result = await connectWallet(seed)

      if (result.success && result.wallet) {
        setWallet(result.wallet)
        setIsConnected(true)

        // Store wallet info in localStorage (only address for security)
        localStorage.setItem("walletAddress", result.wallet.address)
      } else {
        throw new Error("Failed to connect wallet")
      }
    } catch (err) {
      setError("Failed to connect wallet")
      console.error("Wallet connection error:", err)
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    setWallet(null)
    setIsConnected(false)
    localStorage.removeItem("walletAddress")
  }

  // Check for stored wallet on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress")
    if (storedAddress) {
      // We don't store the seed for security reasons
      // This just indicates a previous connection
      setIsConnected(true)
      setWallet({
        address: storedAddress,
        seed: "••••••••••••••••••••••••••••••••", // Masked for security
      })
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnecting,
        isConnected,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}

