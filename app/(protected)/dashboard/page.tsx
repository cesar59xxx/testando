import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentLeads } from "@/components/recent-leads"
import { ActivityChart } from "@/components/activity-chart"
import { InstancesStatus } from "@/components/instances-status"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get instances count and stats
  const { data: instances, count: instancesCount } = await supabase
    .from("whatsapp_instances")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)

  const connectedInstances = instances?.filter((i) => i.status === "connected").length || 0

  // Get leads stats
  const { count: totalLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .in("instance_id", instances?.map((i) => i.id) || [])

  const { count: newLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .in("instance_id", instances?.map((i) => i.id) || [])
    .eq("status", "new")

  const { count: convertedLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .in("instance_id", instances?.map((i) => i.id) || [])
    .eq("status", "converted")

  // Get messages from today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id")
    .in("instance_id", instances?.map((i) => i.id) || [])

  const { count: todayMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .in("conversation_id", conversations?.map((c) => c.id) || [])
    .gte("created_at", today.toISOString())

  // Get recent leads
  const { data: recentLeads } = await supabase
    .from("leads")
    .select(
      `
      *,
      whatsapp_instances(name)
    `,
    )
    .in("instance_id", instances?.map((i) => i.id) || [])
    .order("created_at", { ascending: false })
    .limit(5)

  // Get activity data for chart (last 7 days)
  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)

  const { data: activityData } = await supabase
    .from("analytics_events")
    .select("*")
    .in("instance_id", instances?.map((i) => i.id) || [])
    .gte("created_at", last7Days.toISOString())

  // Calculate conversion rate
  const conversionRate = totalLeads && convertedLeads ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo, {profile?.full_name || user.email}</p>
      </div>

      <DashboardStats
        stats={{
          instances: connectedInstances,
          totalInstances: instancesCount || 0,
          leads: totalLeads || 0,
          newLeads: newLeads || 0,
          messages: todayMessages || 0,
          conversionRate: conversionRate,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart activityData={activityData || []} />
        </div>
        <div>
          <InstancesStatus instances={instances || []} />
        </div>
      </div>

      <RecentLeads leads={recentLeads || []} />
    </div>
  )
}
