// Mock WhatsApp service for demonstration
// In production, this would integrate with WhatsApp Business API or a library like Baileys

interface WhatsAppMessage {
  from: string
  to: string
  content: string
  type: "text" | "image" | "video" | "audio" | "document"
  mediaUrl?: string
}

interface InstanceStatus {
  status: "disconnected" | "connecting" | "connected" | "error"
  phoneNumber?: string
  qrCode?: string
}

class WhatsAppService {
  private instances: Map<string, InstanceStatus> = new Map()

  async initializeInstance(instanceId: string): Promise<{ qrCode: string }> {
    // In production, this would initialize a real WhatsApp connection
    // For now, we'll generate a mock QR code
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=whatsapp-instance-${instanceId}`

    this.instances.set(instanceId, {
      status: "connecting",
      qrCode,
    })

    // Simulate connection after 10 seconds (for demo)
    setTimeout(() => {
      this.instances.set(instanceId, {
        status: "connected",
        phoneNumber: "+55 11 98765-4321",
      })
    }, 10000)

    return { qrCode }
  }

  async getInstanceStatus(instanceId: string): Promise<InstanceStatus | null> {
    return this.instances.get(instanceId) || null
  }

  async sendMessage(instanceId: string, message: WhatsAppMessage): Promise<void> {
    // In production, this would send a real WhatsApp message
    console.log(`[v0] Sending message from ${instanceId}:`, message)
  }

  async receiveWebhook(instanceId: string, payload: any): Promise<WhatsAppMessage | null> {
    // Parse incoming webhook payload
    // This structure depends on the WhatsApp API/library being used
    try {
      return {
        from: payload.from || payload.sender,
        to: instanceId,
        content: payload.message || payload.text || "",
        type: payload.type || "text",
        mediaUrl: payload.mediaUrl,
      }
    } catch (error) {
      console.error("[v0] Error parsing webhook:", error)
      return null
    }
  }

  async disconnectInstance(instanceId: string): Promise<void> {
    this.instances.delete(instanceId)
  }
}

export const whatsappService = new WhatsAppService()
