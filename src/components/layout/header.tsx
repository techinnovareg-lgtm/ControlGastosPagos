"use client"

import { LogOut, Bell, AlertTriangle, Clock, Banknote as BankIcon, Check, User, ChevronDown, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/hooks/useNotifications"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MobileSidebar } from "./mobile-sidebar"

export function Header({ userName }: { userName: string }) {
  const router = useRouter()
  const supabase = createClient()
  const { notifications, hasNewAlerts, markAsRead } = useNotifications()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-2 sm:gap-4">
        <MobileSidebar />
        <div className="hidden sm:block">
          <h1 className="text-2xl font-bold tracking-tight">
            Bienvenido de nuevo, <span className="text-indigo-500">{userName}</span>
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
              Sistema de Control Financiero
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Centro de Notificaciones */}
        <Popover onOpenChange={(open) => open && markAsRead()}>
          <PopoverTrigger asChild>
            <button className="relative p-2 text-muted-foreground transition-colors hover:text-foreground outline-none">
              <Bell className="h-5 w-5" />
              {hasNewAlerts && (
                <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background animate-pulse"></span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 shadow-2xl border-border/50">
            <div className="flex items-center justify-between border-b px-4 py-3 bg-accent/30">
              <h3 className="text-sm font-bold font-heading">Notificaciones</h3>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight">
                {notifications.length} Alertas
              </Badge>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <Check className="h-8 w-8 text-emerald-500/30 mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">¡Todo al día!</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">No tienes pagos ni deudas pendientes de alerta.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-4 transition-colors hover:bg-accent/50 cursor-pointer group",
                        !n.isRead && "bg-primary/5 border-l-2 border-primary"
                      )}
                      onClick={() => {
                        router.push(n.type === 'payment' ? '/dashboard/payments' : '/dashboard/debts')
                      }}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "mt-1 p-1.5 rounded-lg",
                          n.type === 'payment' ? "bg-indigo-500/10 text-indigo-500" : "bg-amber-500/10 text-amber-500"
                        )}>
                          {n.type === 'payment' ? <Clock className="h-3.5 w-3.5" /> : <BankIcon className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-normal">
                            {n.body}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 font-medium">
                            {n.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t bg-accent/20 p-2">
               <button 
                onClick={() => router.push(notifications.some(n => n.type === 'payment') ? '/dashboard/payments' : '/dashboard/debts')}
                className="w-full text-center py-1.5 text-[11px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors"
               >
                 Ver todas las actividades
               </button>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="h-4 w-px bg-border/50"></div>
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 outline-none p-1.5 rounded-full hover:bg-accent/50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline-block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Mi Perfil
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-1 z-50 shadow-2xl border-border/50">
            <button 
              onClick={() => router.push('/dashboard/settings')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-primary transition-colors text-left text-muted-foreground"
            >
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </button>
            <div className="h-px w-full bg-border/50 my-1"></div>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
