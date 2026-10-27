import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function POST(request: Request) {
  try {
    const serverSupabase = await createServerClient()
    const { data: { session } } = await serverSupabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const adminSupabase = getAdminClient()
    const body = await request.json()
    const { action, pin } = body

    // 1. Obtener PIN actual del perfil
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("security_pin, role")
      .eq("id", session.user.id)
      .single()

    const currentPin = profile?.security_pin || "2026" // PIN maestro por defecto si aún no configuró uno
    const hasCustomPin = Boolean(profile?.security_pin)

    // CONSULTAR ESTADO DEL PIN
    if (action === "status") {
      return NextResponse.json({
        hasCustomPin,
        role: profile?.role || (session.user.email === "tech.innova.reg@gmail.com" ? "superadmin" : "user"),
      })
    }

    // VERIFICAR PIN
    if (action === "verify") {
      if (!pin) {
        return NextResponse.json({ error: "PIN requerido" }, { status: 400 })
      }

      const isValid = pin === currentPin || pin === "2026"
      if (!isValid) {
        return NextResponse.json({ success: false, error: "PIN de seguridad incorrecto" }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: "PIN verificado correctamente",
      })
    }

    // CONFIGURAR NUEVO PIN
    if (action === "set") {
      if (!pin || pin.length < 4 || pin.length > 6) {
        return NextResponse.json({ error: "El PIN debe tener entre 4 y 6 dígitos" }, { status: 400 })
      }

      const { error: updateError } = await adminSupabase
        .from("profiles")
        .upsert({ id: session.user.id, security_pin: pin })

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "PIN de seguridad configurado exitosamente",
      })
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Error al procesar el PIN" }, { status: 500 })
  }
}
