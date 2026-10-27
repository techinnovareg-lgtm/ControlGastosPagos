import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DashboardFooter } from "@/components/layout/footer"
import { GlobalCacheProvider } from "@/components/providers/cache-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener perfil y rol del usuario
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, status")
    .eq("id", session.user.id)
    .single()

  // Si el usuario está suspendido, cerrar sesión y enviar a login
  if (profile?.status === "suspended") {
    await supabase.auth.signOut()
    redirect("/login?error=suspended")
  }

  const isSuperAdminEmail = 
    session.user.email === "tech.innova.reg@gmail.com" || 
    session.user.email === "carlos.amambal@gmail.com"

  const userRole = profile?.role || (isSuperAdminEmail ? "superadmin" : "user")
  const userName = profile?.full_name || session.user.email?.split("@")[0] || "Usuario"

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <GlobalCacheProvider>
        {/* Contenedor del sidebar (visible en lg) */}
        <div className="hidden lg:block">
          <Sidebar userRole={userRole} />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header userName={userName} userRole={userRole} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-160px)]">
              <div className="mx-auto max-w-6xl">
                {children}
              </div>
            </div>
            <DashboardFooter />
          </main>
        </div>
      </GlobalCacheProvider>
    </div>
  )
}
