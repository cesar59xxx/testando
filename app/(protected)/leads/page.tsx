import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LeadsList } from "@/components/leads-list"
import { LeadsFilters } from "@/components/leads-filters"

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; instance?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user's instances
  const { data: instances } = await supabase.from("whatsapp_instances").select("id, name").eq("user_id", user.id)

  // Build query for leads
  let query = supabase
    .from("leads")
    .select(
      `
      *,
      whatsapp_instances!inner(id, name, user_id)
    `,
    )
    .eq("whatsapp_instances.user_id", user.id)
    .order("last_interaction", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  // Apply filters
  if (params.status) {
    query = query.eq("status", params.status)
  }

  if (params.instance) {
    query = query.eq("instance_id", params.instance)
  }

  if (params.search) {
    query = query.or(
      `phone_number.ilike.%${params.search}%,name.ilike.%${params.search}%,email.ilike.%${params.search}%`,
    )
  }

  const { data: leads } = await query

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Leads</h1>
        <p className="text-muted-foreground">Gerencie seus contatos e oportunidades</p>
      </div>

      <LeadsFilters instances={instances || []} currentFilters={params} />

      <LeadsList leads={leads || []} />
    </div>
  )
}
