"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { InstanceDetails } from "@/components/instance-details"
import { Loader2 } from "lucide-react"

export default function InstanceDetailPage({ params }: { params: { id: string } }) {
  const [instance, setInstance] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadInstance() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("whatsapp_instances")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single()

      if (error || !data) {
        router.push("/instances")
        return
      }

      setInstance(data)
      setLoading(false)
    }

    loadInstance()
  }, [params.id, router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!instance) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">{instance.name}</h1>
        <p className="text-muted-foreground">Detalhes e configurações da instância</p>
      </div>

      <InstanceDetails instance={instance} />
    </div>
  )
}
