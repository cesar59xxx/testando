import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NewChatbotForm } from "@/components/new-chatbot-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NewChatbotPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: instances } = await supabase.from("whatsapp_instances").select("*").eq("user_id", user.id)

  if (!instances || instances.length === 0) {
    redirect("/chatbots")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Chatbot</h1>
        <p className="text-muted-foreground">Configure seu assistente virtual</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração Básica</CardTitle>
          <CardDescription>Defina as configurações iniciais do chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <NewChatbotForm instances={instances} />
        </CardContent>
      </Card>
    </div>
  )
}
