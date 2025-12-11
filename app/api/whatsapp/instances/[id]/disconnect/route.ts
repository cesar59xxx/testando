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

    const backendUrl = `${BACKEND_CONFIG.baseUrl}${BACKEND_CONFIG.endpoints.whatsapp.disconnect(id)}`

    console.log("[v0] Calling Railway to disconnect:", backendUrl)

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": BACKEND_CONFIG.apiKey,
      },
    })

    if (!backendResponse.ok) {
      throw new Error("Backend disconnect failed")
    }

    const { error: updateError } = await supabase
      .from("whatsapp_instances")
      .update({
        status: "disconnected",
        phone_number: null,
        qr_code: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error disconnecting instance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
