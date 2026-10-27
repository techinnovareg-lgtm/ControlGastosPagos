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

// 1. OBTENER LISTA DE USUARIOS (Solo Superadmin o Admin)
export async function GET(request: Request) {
  try {
    const serverSupabase = await createServerClient()
    const { data: { session } } = await serverSupabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const adminSupabase = getAdminClient()

    // Verificar si el usuario actual es superadmin o admin
    const { data: currentProfile } = await adminSupabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    const isSuperAdminEmail = session.user.email === "tech.innova.reg@gmail.com" || session.user.email === "carlos.amambal@gmail.com"
    const hasAdminRole = currentProfile?.role === "superadmin" || currentProfile?.role === "admin" || isSuperAdminEmail

    if (!hasAdminRole) {
      return NextResponse.json({ error: "Acceso denegado: Se requiere rol Superadmin" }, { status: 403 })
    }

    // Obtener todos los usuarios de Auth y Profiles
    const [{ data: authData, error: authError }, { data: profiles, error: profilesError }] = await Promise.all([
      adminSupabase.auth.admin.listUsers(),
      adminSupabase.from("profiles").select("*"),
    ])

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    const profilesMap = new Map((profiles || []).map((p) => [p.id, p]))

    // Combinar datos
    const users = (authData.users || []).map((u) => {
      const p = profilesMap.get(u.id)
      const isSuper = u.email === "tech.innova.reg@gmail.com" || u.email === "carlos.amambal@gmail.com"
      
      return {
        id: u.id,
        email: u.email,
        fullName: p?.full_name || u.user_metadata?.full_name || u.email?.split("@")[0] || "Usuario",
        role: p?.role || (isSuper ? "superadmin" : "user"),
        status: p?.status || (u.banned_until ? "suspended" : "active"),
        plan: p?.plan || (isSuper ? "business" : "free"),
        createdAt: p?.created_at || u.created_at,
        lastSignInAt: u.last_sign_in_at,
        hasSecurityPin: Boolean(p?.security_pin),
      }
    })

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Error al listar usuarios" }, { status: 500 })
  }
}

// 2. ACTUALIZAR ROL, ESTADO O PLAN DE UN USUARIO
export async function PATCH(request: Request) {
  try {
    const serverSupabase = await createServerClient()
    const { data: { session } } = await serverSupabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const adminSupabase = getAdminClient()

    // Validar autorización del solicitante
    const { data: currentProfile } = await adminSupabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    const isSuperAdminEmail = session.user.email === "tech.innova.reg@gmail.com" || session.user.email === "carlos.amambal@gmail.com"
    const isAuthorized = currentProfile?.role === "superadmin" || isSuperAdminEmail

    if (!isAuthorized) {
      return NextResponse.json({ error: "Solo el Superadmin puede modificar permisos de usuario" }, { status: 403 })
    }

    const body = await request.json()
    const { userId, role, status, plan } = body

    if (!userId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    if (role !== undefined) updateData.role = role
    if (status !== undefined) updateData.status = status
    if (plan !== undefined) updateData.plan = plan

    // Upsert a la tabla profiles
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .upsert({ id: userId, ...updateData })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Si se suspende o activa, actualizar en auth.admin
    if (status === "suspended") {
      await adminSupabase.auth.admin.updateUserById(userId, {
        ban_duration: "876600h", // 100 años
      })
    } else if (status === "active") {
      await adminSupabase.auth.admin.updateUserById(userId, {
        ban_duration: "none",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado con éxito",
      updated: { userId, ...updateData },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Error al actualizar usuario" }, { status: 500 })
  }
}
