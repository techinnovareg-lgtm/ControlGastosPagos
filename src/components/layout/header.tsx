"use client"

import { LogOut, Bell, AlertTriangle, Clock, Banknote as BankIcon, Check, User, ChevronDown, Settings, ShieldAlert, ArrowLeftRight } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"
import { useNotifications } from "@/hooks/useNotifications"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MobileSidebar } from "./mobile-sidebar"

export function Header({ userName, userRole = "user" }: { userName: string; userRole?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { notifications, hasNewAlerts, markAsRead } = useNotifications()

  const isSuperAdmin = userRole === "superadmin" || userRole === "admin"
  const isInAdminPanel = pathname === "/dashboard/admin"

  const handleSignOut = async () => {
    sessionStorage.removeItem("superadmin_pin_verified")
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 sm:px-6 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        <MobileSidebar userRole={userRole} />
        
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {isInAdminPanel ? "Administración de Usuarios" : "Bienvenido de nuevo,"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">
              {isInAdminPanel ? "• Consola Maestra" : userName}
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              {isInAdminPanel ? "Gestión de Cuentas y Accesos" : "Sistema de Control Financiero"}
            </span>
            {isSuperAdmin && (
              <span className="ml-1 text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Superadmin
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        
        {/* Conmutador Rápido para Superadmin: Admin vs Finanzas Personales */}
        {isSuperAdmin && (
          <button
            onClick={() => router.push(isInAdminPanel ? "/dashboard" : "/dashboard/admin")}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-purple-600" />
            <span>{isInAdminPanel ? "Ir a Mis Finanzas" : "Ir a Administración"}</span>
          </button>
        )}

        {/* Centro de Notificaciones */}
        <Popover onOpenChange={(open) => open && markAsRead()}>
          <PopoverTrigger asChild>
            <button className="relative p-2 text-slate-500 transition-colors hover:text-slate-800 hover:bg-slate-100 rounded-xl outline-none">
              <Bell className="h-5 w-5" />
              {hasNewAlerts && (
                <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white animate-pulse"></span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 shadow-2xl border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50">
              <h3 className="text-xs font-bold text-slate-800">Notificaciones</h3>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight bg-white border-slate-200">
                {notifications.length} Alertas
              </Badge>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <Check className="h-8 w-8 text-emerald-500/50 mb-2" />
                  <p className="text-xs text-slate-700 font-bold">¡Todo al día!</p>
                  <p className="text-[11px] text-slate-400 mt-1">No tienes pagos ni deudas pendientes de alerta.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-3.5 transition-colors hover:bg-slate-50 cursor-pointer group",
                        !n.isRead && "bg-indigo-50/40 border-l-2 border-indigo-600"
                      )}
                      onClick={() => {
                        router.push(n.type === 'payment' ? '/dashboard/payments' : '/dashboard/debts')
                      }}
                    >
                      <div className="flex gap-2.5">
                        <div className={cn(
                          "mt-0.5 p-1.5 rounded-lg shrink-0",
                          n.type === 'payment' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {n.type === 'payment' ? <Clock className="h-3.5 w-3.5" /> : <BankIcon className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-normal">
                            {n.body}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {n.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t border-slate-100 bg-slate-50 p-2">
               <button 
                onClick={() => router.push(notifications.some(n => n.type === 'payment') ? '/dashboard/payments' : '/dashboard/debts')}
                className="w-full text-center py-1.5 text-[10px] font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-wider transition-colors"
               >
                 Ver todas las actividades
               </button>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="h-4 w-px bg-slate-200"></div>
        
        {/* Dropdown de Usuario */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 outline-none p-1.5 rounded-full hover:bg-slate-100 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs border border-indigo-100 shadow-sm">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors">
                Mi Perfil
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-1.5 z-50 shadow-2xl border-slate-200 bg-white">
            
            {isSuperAdmin && (
              <>
                <button 
                  onClick={() => router.push(isInAdminPanel ? "/dashboard" : "/dashboard/admin")}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-purple-600" />
                    <span>{isInAdminPanel ? "Mis Finanzas Personales" : "Panel Superadmin"}</span>
                  </span>
                </button>
                <div className="h-px w-full bg-slate-100 my-1"></div>
              </>
            )}

            <button 
              onClick={() => router.push('/dashboard/settings')}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left text-slate-700"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Configuración</span>
            </button>
            
            <div className="h-px w-full bg-slate-100 my-1"></div>
            
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left"
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
