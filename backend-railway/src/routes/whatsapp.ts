import { Router } from "express"
import { WhatsAppManager } from "../services/whatsapp-manager"
import { createClient } from "@supabase/supabase-js"

const router = Router()
const whatsappManager = WhatsAppManager.getInstance()

const supabase = createClient(
  process.env.SUPABASE_URL || "https://kojduqsmxipoayecuvsi.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig",
)

router.post("/instances/:id/connect", async (req, res) => {
  try {
    const { id } = req.params
    const { instanceId, userId } = req.body

    console.log(`[Railway API] Conectando instância ${id}`)

    const { data: instance, error } = await supabase.from("whatsapp_instances").select("*").eq("id", id).single()

    if (error || !instance) {
      return res.status(404).json({ error: "Instância não encontrada" })
    }

    await whatsappManager.initializeClient(instance.id, instance.user_id)

    res.json({ success: true, message: "Conexão iniciada" })
  } catch (error) {
    console.error("[Railway API] Erro ao conectar:", error)
    res.status(500).json({ error: "Erro ao conectar instância" })
  }
})

router.get("/instances/:id/status", async (req, res) => {
  try {
    const { id } = req.params

    console.log(`[Railway API] Buscando status da instância ${id}`)

    const statusData = whatsappManager.getStatus(id)

    res.json(statusData)
  } catch (error) {
    console.error("[Railway API] Erro ao obter status:", error)
    res.status(500).json({ error: "Erro ao obter status" })
  }
})

router.post("/instances/:id/disconnect", async (req, res) => {
  try {
    const { id } = req.params

    console.log(`[Railway API] Desconectando instância ${id}`)

    await whatsappManager.disconnectClient(id)

    await supabase
      .from("whatsapp_instances")
      .update({
        status: "disconnected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    res.json({ success: true, message: "Desconectado com sucesso" })
  } catch (error) {
    console.error("[Railway API] Erro ao desconectar:", error)
    res.status(500).json({ error: "Erro ao desconectar instância" })
  }
})

router.post("/instances/:id/send", async (req, res) => {
  try {
    const { id } = req.params
    const { to, message } = req.body

    if (!to || !message) {
      return res.status(400).json({ error: "Destinatário e mensagem são obrigatórios" })
    }

    console.log(`[Railway API] Enviando mensagem da instância ${id} para ${to}`)

    const messageId = await whatsappManager.sendMessage(id, to, message)

    res.json({ success: true, messageId })
  } catch (error) {
    console.error("[Railway API] Erro ao enviar mensagem:", error)
    res.status(500).json({ error: error instanceof Error ? error.message : "Erro ao enviar mensagem" })
  }
})

export { router as whatsappRouter }
