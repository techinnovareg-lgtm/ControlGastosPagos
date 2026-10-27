import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 selection:bg-indigo-500 selection:text-white relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Luces y resplandores ambientales estilo Pixer Claro */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/60 via-purple-100/40 to-cyan-100/50 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-100/50 via-indigo-50/60 to-purple-100/40 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      {/* Patrón de cuadrícula tenue */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none -z-10" />

      {/* Contenedor Principal */}
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500 my-auto">
        {children}
      </div>

      {/* Botón Flotante de WhatsApp para soporte */}
      <WhatsAppButton />
    </div>
  )
}
