import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NewInstanceForm } from "@/components/new-instance-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NewInstancePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Nova Instância</h1>
        <p className="text-muted-foreground">Conecte uma nova conta do WhatsApp</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Instância</CardTitle>
          <CardDescription>Digite um nome identificador para esta instância</CardDescription>
        </CardHeader>
        <CardContent>
          <NewInstanceForm />
        </CardContent>
      </Card>
    </div>
  )
}
