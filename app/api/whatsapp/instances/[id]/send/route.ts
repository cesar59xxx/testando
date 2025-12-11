import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { BACKEND_CONFIG } from "@/lib/config/backend"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: instance, error: instanceError } = await supabase
      .from("whatsapp_instances")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (instanceError || !instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 })
    }

    const body = await request.json()
    const { to, message, mediaUrl, caption } = body

    if (!to || (!message && !mediaUrl)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const backendUrl = `${BACKEND_CONFIG.baseUrl}${BACKEND_CONFIG.endpoints.whatsapp.send(id)}`

    console.log("[v0] Sending message via Railway:", backendUrl)

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": BACKEND_CONFIG.apiKey,
      },
      body: JSON.stringify({ to, message, mediaUrl, caption }),
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      throw new Error(errorData.error || "Failed to send message")
    }

    const result = await backendResponse.json()

    await supabase.from("analytics_events").insert({
      instance_id: id,
      event_type: "message_sent",
      event_data: { to, hasMedia: !!mediaUrl },
    })

    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
