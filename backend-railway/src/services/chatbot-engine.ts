import { createClient } from "@supabase/supabase-js"

export class ChatbotEngine {
  private supabase

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || "https://kojduqsmxipoayecuvsi.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig",
    )
  }

  async processMessage(instanceId: string, from: string, message: string): Promise<string | null> {
    // Buscar chatbot ativo da instância
    const { data: chatbot } = await this.supabase
      .from("chatbots")
      .select("*")
      .eq("instance_id", instanceId)
      .eq("is_active", true)
      .single()

    if (!chatbot) {
      return null // Sem chatbot ativo
    }

    // Processar com fluxos
    const flows = chatbot.flows || []
    const messageLower = message.toLowerCase().trim()

    for (const flow of flows) {
      const keywords = flow.keywords || []
      const hasKeyword = keywords.some((k: string) => messageLower.includes(k.toLowerCase()))

      if (hasKeyword) {
        return flow.response
      }
    }

    // Resposta padrão
    return chatbot.welcome_message || "Olá! Como posso ajudar?"
  }
}
