import { Client, LocalAuth } from "whatsapp-web.js"
import { createClient } from "@supabase/supabase-js"
import { ChatbotEngine } from "./chatbot-engine"

interface ClientData {
  client: Client
  qrCode: string | null
  status: "initializing" | "qr_code" | "connected" | "disconnected"
  userId: string
  phoneNumber: string | null
}

export class WhatsAppManager {
  private static instance: WhatsAppManager
  private clients: Map<string, ClientData> = new Map()
  private supabase
  private chatbotEngine: ChatbotEngine

  private constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || "https://kojduqsmxipoayecuvsi.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig",
    )
    this.chatbotEngine = new ChatbotEngine()
  }

  public static getInstance(): WhatsAppManager {
    if (!WhatsAppManager.instance) {
      WhatsAppManager.instance = new WhatsAppManager()
    }
    return WhatsAppManager.instance
  }

  async initializeClient(instanceId: string, userId: string): Promise<void> {
    if (this.clients.has(instanceId)) {
      console.log(`[WhatsApp Manager] Cliente ${instanceId} já existe`)
      return
    }

    console.log(`[WhatsApp Manager] Inicializando cliente ${instanceId}`)

    const client = new Client({
      authStrategy: new LocalAuth({ clientId: instanceId }),
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      },
    })

    const clientData: ClientData = {
      client,
      qrCode: null,
      status: "initializing",
      userId,
      phoneNumber: null,
    }

    this.clients.set(instanceId, clientData)

    client.on("qr", async (qr) => {
      console.log(`[WhatsApp Manager] QR Code gerado para ${instanceId}`)
      clientData.qrCode = qr
      clientData.status = "qr_code"

      await this.supabase
        .from("whatsapp_instances")
        .update({
          status: "qr_code",
          qr_code: qr,
          updated_at: new Date().toISOString(),
        })
        .eq("id", instanceId)
    })

    client.on("ready", async () => {
      console.log(`[WhatsApp Manager] Cliente ${instanceId} conectado!`)
      clientData.status = "connected"
      clientData.qrCode = null

      const info = await client.info
      clientData.phoneNumber = info.wid.user

      await this.supabase
        .from("whatsapp_instances")
        .update({
          status: "connected",
          phone_number: info.wid.user,
          qr_code: null,
          connected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", instanceId)
    })

    client.on("message", async (msg) => {
      console.log(`[WhatsApp Manager] Mensagem recebida em ${instanceId}: ${msg.body}`)

      await this.supabase.from("messages").insert({
        instance_id: instanceId,
        from_number: msg.from,
        message_type: msg.type,
        content: msg.body,
        direction: "incoming",
        timestamp: new Date(msg.timestamp * 1000).toISOString(),
      })

      const response = await this.chatbotEngine.processMessage(instanceId, msg.from, msg.body)

      if (response) {
        console.log(`[WhatsApp Manager] Enviando resposta automática: ${response}`)
        await client.sendMessage(msg.from, response)

        await this.supabase.from("messages").insert({
          instance_id: instanceId,
          to_number: msg.from,
          message_type: "text",
          content: response,
          direction: "outgoing",
          timestamp: new Date().toISOString(),
        })
      }
    })

    client.on("disconnected", async (reason) => {
      console.log(`[WhatsApp Manager] Cliente ${instanceId} desconectado: ${reason}`)
      clientData.status = "disconnected"

      await this.supabase
        .from("whatsapp_instances")
        .update({
          status: "disconnected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", instanceId)

      this.clients.delete(instanceId)
    })

    await client.initialize()
  }

  getQRCode(instanceId: string): string | null {
    const clientData = this.clients.get(instanceId)
    return clientData?.qrCode || null
  }

  getStatus(instanceId: string): { status: string; phoneNumber?: string; qrCode?: string } {
    const clientData = this.clients.get(instanceId)
    if (!clientData) {
      return { status: "disconnected" }
    }

    return {
      status: clientData.status,
      phoneNumber: clientData.phoneNumber || undefined,
      qrCode: clientData.qrCode || undefined,
    }
  }

  async sendMessage(instanceId: string, to: string, message: string): Promise<string> {
    const clientData = this.clients.get(instanceId)

    if (!clientData || clientData.status !== "connected") {
      throw new Error("Cliente não conectado")
    }

    console.log(`[WhatsApp Manager] Enviando mensagem de ${instanceId} para ${to}`)

    const result = await clientData.client.sendMessage(to, message)

    await this.supabase.from("messages").insert({
      instance_id: instanceId,
      to_number: to,
      message_type: "text",
      content: message,
      direction: "outgoing",
      timestamp: new Date().toISOString(),
    })

    return result.id.id
  }

  async disconnectClient(instanceId: string): Promise<void> {
    const clientData = this.clients.get(instanceId)

    if (clientData) {
      console.log(`[WhatsApp Manager] Desconectando cliente ${instanceId}`)
      await clientData.client.destroy()
      this.clients.delete(instanceId)
    }
  }
}
