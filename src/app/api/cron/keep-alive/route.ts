import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Credenciales de servicio de Supabase no configuradas" },
      { status: 500 }
    )
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // 1. Ejecutar consultas de latido (Keep-Alive) para mantener activas las conexiones de base de datos
    const [profilesRes, accountsRes, paymentsRes] = await Promise.all([
      supabase.from("profiles").select("count", { count: "exact", head: true }),
      supabase.from("accounts").select("count", { count: "exact", head: true }),
      supabase.from("payments").select("count", { count: "exact", head: true }),
    ])

    const timestamp = new Date().toISOString()

    return NextResponse.json({
      success: true,
      service: "ControlTotal Supabase Keep-Alive Engine",
      provider: "Tech Innova Cloud Services",
      status: "active",
      timestamp,
      keepAliveInterval: "Cada 2 días (Vercel Cron)",
      metrics: {
        totalProfiles: profilesRes.count ?? 0,
        totalAccounts: accountsRes.count ?? 0,
        totalPayments: paymentsRes.count ?? 0,
      },
      message: "Base de datos Supabase activada con éxito para prevenir suspensión por inactividad.",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Error al ejecutar el latido de Supabase",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
