import type { Database } from "@/lib/types/database"

type ChatbotConfig = Database["public"]["Tables"]["chatbot_configs"]["Row"]

export interface ChatbotResponse {
  message: string
  options?: Array<{ id: string; text: string }>
  shouldEndConversation?: boolean
}

class ChatbotService {
  async processMessage(
    config: ChatbotConfig,
    message: string,
    conversationContext: any = {},
  ): Promise<ChatbotResponse> {
    // If chatbot is not active, return null
    if (!config.is_active) {
      return {
        message: "O chatbot está desativado no momento.",
        shouldEndConversation: true,
      }
    }

    // Check if this is the first message
    if (!conversationContext.hasInteracted) {
      const options = (config.initial_options as any[]) || []
      return {
        message: config.welcome_message,
        options: options.map((opt: any, idx: number) => ({
          id: `opt_${idx}`,
          text: opt.text || opt,
        })),
      }
    }

    // Process based on flows
    const flows = (config.flows as any[]) || []

    // Simple keyword-based matching
    const matchedFlow = flows.find((flow: any) => {
      const keywords = flow.keywords || []
      return keywords.some((keyword: string) => message.toLowerCase().includes(keyword.toLowerCase()))
    })

    if (matchedFlow) {
      return {
        message: matchedFlow.response || "Entendi sua mensagem!",
        options: matchedFlow.options,
      }
    }

    // If OpenAI is enabled, use AI to generate response
    if (config.openai_enabled && config.openai_api_key) {
      try {
        const aiResponse = await this.getAIResponse(
          config.openai_api_key,
          config.openai_model,
          config.openai_instructions || "",
          message,
        )
        return {
          message: aiResponse,
        }
      } catch (error) {
        console.error("[v0] OpenAI error:", error)
      }
    }

    // Fallback message
    return {
      message: config.fallback_message || "Desculpe, não entendi sua mensagem. Como posso ajudar?",
    }
  }

  private async getAIResponse(apiKey: string, model: string, instructions: string, message: string): Promise<string> {
    // In production, integrate with OpenAI API
    // For now, return a mock response
    return `Resposta da IA para: "${message}". (Integração OpenAI será implementada)`
  }
}

export const chatbotService = new ChatbotService()
