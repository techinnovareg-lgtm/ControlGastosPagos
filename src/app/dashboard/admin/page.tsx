"use client"

import * as React from "react"
import { 
  Users, Shield, ShieldCheck, ShieldAlert, UserCheck, 
  UserX, Search, Filter, RefreshCw, KeyRound, Lock, 
  CheckCircle2, AlertTriangle, Activity, Database, 
  Clock, Sparkles, Mail, Copy, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PinGuard } from "@/components/admin/pin-guard"

interface AdminUser {
  id: string
  email: string
  fullName: string
  role: "user" | "admin" | "superadmin"
  status: "active" | "suspended"
  plan: "free" | "pro" | "business"
  createdAt: string
  lastSignInAt: string | null
  hasSecurityPin: boolean
}

export default function AdminPage() {
  const [isUnlocked, setIsUnlocked] = React.useState(false)
  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)

  // Filtros y Búsqueda
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [copiedEmail, setCopiedEmail] = React.useState<string | null>(null)

  // Estado del Keep-Alive
  const [pingStatus, setPingStatus] = React.useState<string | null>(null)
  const [pingLoading, setPingLoading] = React.useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al cargar usuarios")
      setUsers(data.users || [])
    } catch (err: any) {
      setError(err.message || "Error al comunicarse con la base de datos")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (isUnlocked) {
      fetchUsers()
    }
  }, [isUnlocked])

  const handleUpdateUser = async (userId: string, fields: Partial<AdminUser>) => {
    setUpdatingId(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...fields }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al actualizar")

      // Actualizar estado local
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...fields } : u))
      )
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleTriggerKeepAlive = async () => {
    setPingLoading(true)
    try {
      const res = await fetch("/api/cron/keep-alive")
      const data = await res.json()
      if (res.ok) {
        setPingStatus(`Ping exitoso (${new Date().toLocaleTimeString()}): Supabase activo`)
      } else {
        setPingStatus("Error al ejecutar ping de Supabase")
      }
    } catch {
      setPingStatus("Error de red al conectar")
    } finally {
      setPingLoading(false)
    }
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  // Si no está desbloqueado por PIN, mostramos el teclado de seguridad
  if (!isUnlocked) {
    return (
      <div className="py-12">
        <PinGuard onUnlocked={() => setIsUnlocked(true)} />
      </div>
    )
  }

  // Filtrado de usuarios
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    const matchesStatus = statusFilter === "all" || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // Métricas calculadas
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const proUsers = users.filter((u) => u.plan === "pro" || u.plan === "business").length
  const superadmins = users.filter((u) => u.role === "superadmin").length

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header del Panel Superadmin */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">
              Panel Superadmin
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Tech Innova Security
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Control maestro de usuarios, permisos, planes y monitoreo de base de datos
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
            className="text-xs font-semibold"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUnlocked(false)}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/30"
          >
            <Lock className="h-3.5 w-3.5 mr-1.5" />
            Bloquear con PIN
          </Button>
        </div>
      </div>

      {/* 2. Tarjetas de Métricas de Sistema */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Total de Usuarios</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Registrados en la plataforma</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Usuarios Activos</span>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500">{activeUsers}</div>
          <p className="text-[11px] text-muted-foreground mt-1">{totalUsers - activeUsers} suspendidos</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Planes Pro / Business</span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-500">{proUsers}</div>
          <p className="text-[11px] text-muted-foreground mt-1">{totalUsers - proUsers} en plan Free</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Superadministradores</span>
            <ShieldCheck className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-cyan-500">{superadmins}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Acceso maestro activo</p>
        </div>

      </div>

      {/* 3. Banner de Monitoreo Keep-Alive Supabase */}
      <div className="p-4 rounded-2xl bg-accent/20 border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>Supabase Keep-Alive Engine</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 font-semibold">Cron Activo Cada 2 Días</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {pingStatus || "Previene que el proyecto entre en pausa automática por inactividad."}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleTriggerKeepAlive}
          disabled={pingLoading}
          className="text-xs font-semibold shrink-0"
        >
          <Activity className={`h-3.5 w-3.5 mr-1.5 ${pingLoading ? "animate-spin" : ""}`} />
          {pingLoading ? "Enviando Ping..." : "Probar Ping Ahora"}
        </Button>
      </div>

      {/* 4. Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-xl">
            <Filter className="h-3.5 w-3.5" />
            <span>Rol:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-foreground font-semibold outline-none cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="superadmin">Superadmin</option>
              <option value="admin">Admin</option>
              <option value="user">Usuario</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-xl">
            <span>Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-foreground font-semibold outline-none cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="active">Activo</option>
              <option value="suspended">Suspendido</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Tabla de Gestión de Usuarios */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-accent/20 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Usuario</th>
                <th className="py-3.5 px-4">Rol en Sistema</th>
                <th className="py-3.5 px-4">Plan Asignado</th>
                <th className="py-3.5 px-4">Estado Acceso</th>
                <th className="py-3.5 px-4">Registro</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    {loading ? "Cargando lista de usuarios..." : "No se encontraron usuarios coincidentes."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuper = u.role === "superadmin"
                  const isUpdating = updatingId === u.id

                  return (
                    <tr key={u.id} className="hover:bg-accent/30 transition-colors">
                      {/* Usuario & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSuper 
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                              : "bg-primary/10 text-primary"
                          }`}>
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-foreground flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isSuper && (
                                <span title="Superadministrador" className="inline-flex items-center">
                                  <Shield className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <span>{u.email}</span>
                              <button
                                onClick={() => handleCopyEmail(u.email)}
                                className="p-0.5 hover:text-foreground transition-colors"
                                title="Copiar correo"
                              >
                                {copiedEmail === u.email ? (
                                  <Check className="h-3 w-3 text-emerald-500" />
                                ) : (
                                  <Copy className="h-3 w-3 opacity-60" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Selector de Rol */}
                      <td className="py-3.5 px-4">
                        <select
                          disabled={isUpdating}
                          value={u.role}
                          onChange={(e) =>
                            handleUpdateUser(u.id, {
                              role: e.target.value as AdminUser["role"],
                            })
                          }
                          className="px-2.5 py-1 rounded-lg text-xs font-bold border border-border/80 bg-background text-foreground cursor-pointer outline-none focus:border-primary"
                        >
                          <option value="user">Usuario Común</option>
                          <option value="admin">Administrador</option>
                          <option value="superadmin">Superadmin</option>
                        </select>
                      </td>

                      {/* Selector de Plan */}
                      <td className="py-3.5 px-4">
                        <select
                          disabled={isUpdating}
                          value={u.plan}
                          onChange={(e) =>
                            handleUpdateUser(u.id, {
                              plan: e.target.value as AdminUser["plan"],
                            })
                          }
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-border/80 bg-background text-foreground cursor-pointer outline-none focus:border-primary"
                        >
                          <option value="free">Free (Básico)</option>
                          <option value="pro">Pro (S/. 19.90)</option>
                          <option value="business">Business (S/. 59.90)</option>
                        </select>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            u.status === "active"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              u.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {u.status === "active" ? "Activo" : "Suspendido"}
                        </span>
                      </td>

                      {/* Fecha de Registro */}
                      <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>

                      {/* Botón de Acción Rápida: Suspender / Reactivar */}
                      <td className="py-3.5 px-4 text-right">
                        {u.email === "tech.innova.reg@gmail.com" ? (
                          <span className="text-[10px] text-muted-foreground font-bold">Principal</span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateUser(u.id, {
                                status: u.status === "active" ? "suspended" : "active",
                              })
                            }
                            className={`h-7 px-2.5 text-[11px] font-bold ${
                              u.status === "active"
                                ? "text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/30"
                                : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                            }`}
                          >
                            {u.status === "active" ? "Suspender" : "Reactivar"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
