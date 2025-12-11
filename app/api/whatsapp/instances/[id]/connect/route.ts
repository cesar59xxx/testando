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

    const backendUrl = `${BACKEND_CONFIG.baseUrl}${BACKEND_CONFIG.endpoints.whatsapp.connect(id)}`

    console.log("[v0] Calling Railway backend:", backendUrl)

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": BACKEND_CONFIG.apiKey,
      },
      body: JSON.stringify({
        instanceId: id,
        userId: user.id,
      }),
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      throw new Error(errorData.error || "Backend error")
    }

    const data = await backendResponse.json()

    await supabase
      .from("whatsapp_instances")
      .update({
        status: "connecting",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error connecting instance:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
