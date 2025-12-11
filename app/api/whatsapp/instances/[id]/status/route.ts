import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { BACKEND_CONFIG } from "@/lib/config/backend"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const backendUrl = `${BACKEND_CONFIG.baseUrl}${BACKEND_CONFIG.endpoints.whatsapp.status(id)}`

    console.log("[v0] Fetching status from Railway:", backendUrl)

    const backendResponse = await fetch(backendUrl, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": BACKEND_CONFIG.apiKey,
      },
    })

    if (!backendResponse.ok) {
      console.error("[v0] Backend error:", await backendResponse.text())
      return NextResponse.json({
        status: instance.status,
        phoneNumber: instance.phone_number,
        qrCode: instance.qr_code,
      })
    }

    const data = await backendResponse.json()

    if (data.status !== instance.status) {
      await supabase
        .from("whatsapp_instances")
        .update({
          status: data.status,
          phone_number: data.phoneNumber,
          qr_code: data.qrCode || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
    }

    return NextResponse.json({
      status: data.status || instance.status,
      phoneNumber: data.phoneNumber || instance.phone_number,
      qrCode: data.qrCode || instance.qr_code,
    })
  } catch (error) {
    console.error("[v0] Error fetching status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
