import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

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
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 -translate-y-12 translate-x-1/3 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 translate-y-1/3 -translate-x-1/3 left-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md p-6 z-10 glass rounded-2xl animate-in fade-in zoom-in-95 duration-500">
        {children}
      </div>
    </div>
  )
}
