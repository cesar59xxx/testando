import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ChatbotsList } from "@/components/chatbots-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ChatbotsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get all instances for this user
  const { data: instances } = await supabase.from("whatsapp_instances").select("id, name").eq("user_id", user.id)

  // Get all chatbots with their instance info
  const { data: chatbots } = await supabase
    .from("chatbot_configs")
    .select(
      `
      *,
      whatsapp_instances!inner(id, name, user_id)
    `,
    )
    .eq("whatsapp_instances.user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chatbots</h1>
          <p className="text-muted-foreground">Configure seus assistentes virtuais</p>
        </div>
        <Button asChild disabled={!instances || instances.length === 0}>
          <Link href="/chatbots/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Chatbot
          </Link>
        </Button>
      </div>

      {instances && instances.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Você precisa criar uma instância do WhatsApp antes de configurar chatbots.
          </p>
          <Button asChild className="mt-4">
            <Link href="/instances/new">Criar Instância</Link>
          </Button>
        </div>
      ) : (
        <ChatbotsList chatbots={chatbots || []} />
      )}
    </div>
  )
}
