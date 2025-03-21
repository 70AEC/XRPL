// A browser-compatible XRPL client implementation
export class XRPLClient {
  private url: string
  private connected = false
  private socket: WebSocket | null = null
  private requestId = 0
  private pendingRequests: Map<number, { resolve: Function; reject: Function }> = new Map()

  constructor(url: string) {
    this.url = url
  }

  async connect(): Promise<void> {
    if (this.connected) return

    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url)

        this.socket.onopen = () => {
          this.connected = true
          console.log("WebSocket connected to", this.url)
          resolve()
        }

        this.socket.onclose = () => {
          this.connected = false
          console.log("WebSocket disconnected")
        }

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error)
          reject(error)
        }

        this.socket.onmessage = (event) => {
          const response = JSON.parse(event.data)
          const requestId = response.id

          if (this.pendingRequests.has(requestId)) {
            const { resolve, reject } = this.pendingRequests.get(requestId)!

            if (response.status === "success" || response.result) {
              resolve(response.result || response)
            } else {
              reject(response.error || new Error("Unknown error"))
            }

            this.pendingRequests.delete(requestId)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  async disconnect(): Promise<void> {
    if (!this.connected || !this.socket) return

    this.socket.close()
    this.connected = false
    this.socket = null
  }

  isConnected(): boolean {
    return this.connected
  }

  async request(request: any): Promise<any> {
    if (!this.connected || !this.socket) {
      throw new Error("Not connected to XRPL")
    }

    const id = ++this.requestId
    const message = {
      id,
      command: request.command,
      ...request,
    }

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject })
      this.socket!.send(JSON.stringify(message))
    })
  }

  async submitTransaction(transaction: any, wallet: any): Promise<any> {
    // In a real implementation, this would sign and submit the transaction
    // For now, we'll simulate a successful submission
    return {
      id: `TX_${Date.now()}`,
      status: "success",
      transaction_hash: `${Math.random().toString(36).substring(2, 15)}`,
      validated: true,
    }
  }

  generateWallet(): any {
    // Generate a random wallet for demo purposes
    const address = `r${Math.random().toString(36).substring(2, 15)}`
    const seed = `s${Math.random().toString(36).substring(2, 15)}`

    return {
      address,
      seed,
      publicKey: `p${Math.random().toString(36).substring(2, 15)}`,
      privateKey: `k${Math.random().toString(36).substring(2, 15)}`,
    }
  }

  createWalletFromSeed(seed: string): any {
    // In a real implementation, this would derive the keys from the seed
    // For now, we'll create a deterministic wallet based on the seed
    const address = `r${this.hashString(seed).substring(0, 20)}`

    return {
      address,
      seed,
      publicKey: `p${this.hashString(seed).substring(0, 20)}`,
      privateKey: `k${this.hashString(seed).substring(0, 20)}`,
    }
  }

  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36)
  }
}

