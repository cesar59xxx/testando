import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { InstancesList } from "@/components/instances-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function InstancesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: instances } = await supabase
    .from("whatsapp_instances")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Instâncias WhatsApp</h1>
          <p className="text-muted-foreground">Gerencie suas conexões do WhatsApp</p>
        </div>
        <Button asChild>
          <Link href="/instances/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Instância
          </Link>
        </Button>
      </div>

      <InstancesList instances={instances || []} />
    </div>
  )
}
