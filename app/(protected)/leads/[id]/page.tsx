"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LeadDetails } from "@/components/lead-details"
import { Loader2 } from "lucide-react"

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const [lead, setLead] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadLead() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/auth/login")
        return
      }

      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .select(
          `
          *,
          whatsapp_instances!inner(id, name, user_id)
        `,
        )
        .eq("id", params.id)
        .eq("whatsapp_instances.user_id", user.id)
        .single()

      if (leadError || !leadData) {
        router.push("/leads")
        return
      }

      const { data: conversationsData } = await supabase
        .from("conversations")
        .select(
          `
          *,
          messages(*)
        `,
        )
        .eq("lead_id", params.id)
        .order("created_at", { ascending: false })

      setLead(leadData)
      setConversations(conversationsData || [])
      setLoading(false)
    }

    loadLead()
  }, [params.id, router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!lead) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">{lead.name || lead.phone_number}</h1>
        <p className="text-muted-foreground">Detalhes do lead</p>
      </div>

      <LeadDetails lead={lead} conversations={conversations} />
    </div>
  )
}
