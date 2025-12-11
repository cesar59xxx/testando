import { Router } from "express"
import { createClient } from "@supabase/supabase-js"
import { ChatbotEngine } from "../services/chatbot-engine"

const router = Router()
const chatbotEngine = new ChatbotEngine()

const supabase = createClient(
  process.env.SUPABASE_URL || "https://kojduqsmxipoayecuvsi.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig",
)

// Receber mensagens do WhatsApp
router.post("/message", async (req, res) => {
  try {
    const { instanceId, from, message, timestamp } = req.body

    // Salvar mensagem no banco
    const { error: messageError } = await supabase.from("messages").insert({
      instance_id: instanceId,
      from_number: from,
      message_type: "text",
      content: message,
      direction: "incoming",
      timestamp: timestamp || new Date().toISOString(),
    })

    if (messageError) {
      console.error("Erro ao salvar mensagem:", messageError)
    }

    // Processar com chatbot se ativo
    const response = await chatbotEngine.processMessage(instanceId, from, message)

    res.json({ success: true, response })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)
    res.status(500).json({ error: "Erro ao processar mensagem" })
  }
})

export { router as webhookRouter }
