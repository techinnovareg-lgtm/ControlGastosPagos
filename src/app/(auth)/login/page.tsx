"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { 
  Loader2, Mail, Lock, ArrowRight, ShieldCheck, 
  HelpCircle, CheckCircle2, MessageCircle, ArrowLeft,
  ChevronDown, KeyRound, ShieldAlert
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const [inputEmail, setInputEmail] = React.useState("")
  const [superadminPin, setSuperadminPin] = React.useState("")
  const [showAdminPinInput, setShowAdminPinInput] = React.useState(false)

  // Estado para modal / vista de "Olvidé mi contraseña"
  const [isResetMode, setIsResetMode] = React.useState(false)
  const [resetEmail, setResetEmail] = React.useState("")
  const [resetSuccess, setResetSuccess] = React.useState(false)
  const [resetLoading, setResetLoading] = React.useState(false)

  // Estado para menú de soporte
  const [showSupportMenu, setShowSupportMenu] = React.useState(false)

  const isSuperAdminEmail = 
    inputEmail.toLowerCase().includes("tech.innova.reg@gmail.com") ||
    inputEmail.toLowerCase().includes("carlos.amambal@gmail.com") ||
    showAdminPinInput

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = (formData.get("email") as string).trim()
    const password = formData.get("password") as string
    const pin = (formData.get("pin") as string || superadminPin).trim()

    const isSuper = 
      email.toLowerCase() === "tech.innova.reg@gmail.com" || 
      email.toLowerCase() === "carlos.amambal@gmail.com"

    // 1. Si es Superadmin, requerir y validar PIN en el LOGIN
    if (isSuper) {
      if (!pin) {
        setShowAdminPinInput(true)
        setError("Acceso Superadmin detectado: Ingresa tu PIN de autorización de 4 dígitos (Inicial: 2026).")
        setLoading(false)
        return
      }

      // Validar PIN contra 2026 o backend
      if (pin !== "2026") {
        setError("PIN de autorización incorrecto. (PIN inicial de respaldo: 2026)")
        setLoading(false)
        return
      }
    }

    // 2. Iniciar sesión con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      let friendlyMessage = authError.message
      if (authError.message.includes("Invalid login credentials")) {
        friendlyMessage = "Credenciales incorrectas. Verifica tu correo y contraseña."
      } else if (authError.message.includes("Email not confirmed")) {
        friendlyMessage = "Correo electrónico no confirmado. Por favor confirma tu cuenta desde el correo recibido o contacta a soporte."
      }
      setError(friendlyMessage)
      setLoading(false)
      return
    }

    // 3. Redirección inteligente: Superadmin va directo a Administración, usuario regular va al Dashboard
    if (isSuper) {
      sessionStorage.setItem("superadmin_pin_verified", "true")
      router.push("/dashboard/admin")
    } else {
      router.push("/dashboard")
    }
    router.refresh()
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setError(null)

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/dashboard/settings`,
      })

      if (resetErr) {
        setError(resetErr.message)
      } else {
        setResetSuccess(true)
      }
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al enviar el correo.")
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-indigo-950/10 p-7 sm:p-9 text-slate-800">
      
      {/* 1. Header con Logo de ControlTotal en marco blanco y suave */}
      <div className="flex flex-col items-center text-center space-y-2 mb-7">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-1">
          <div className="relative h-12 w-12 transition-transform group-hover:scale-105">
            <Image
              src="/brand/controltotal-icon.svg"
              alt="ControlTotal Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
              Control<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">Total</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
              by Tech Innova
            </span>
          </div>
        </Link>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {isResetMode ? "Recuperar Contraseña" : "¡Bienvenido de nuevo!"}
        </h1>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          {isResetMode 
            ? "Ingresa tu correo para enviarte las instrucciones de restablecimiento"
            : "Ingresa tus credenciales para acceder al sistema"}
        </p>
      </div>

      {/* 2. Formulario de Inicio de Sesión o Recuperación */}
      {isResetMode ? (
        /* Vista: Olvidé mi contraseña */
        <div className="space-y-4">
          {resetSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <div className="text-sm font-bold text-emerald-800">Correo Enviado</div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Hemos enviado un enlace a <strong>{resetEmail}</strong> con las instrucciones para restablecer tu contraseña.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsResetMode(false)
                  setResetSuccess(false)
                }}
                className="mt-3 w-full text-xs font-semibold rounded-xl border-emerald-200 bg-white hover:bg-emerald-100 text-emerald-800"
              >
                Volver a Iniciar Sesión
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5" htmlFor="reset-email">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="m@ejemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={resetLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all"
              >
                {resetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Enviar Enlace de Recuperación
              </Button>

              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false)
                  setError(null)
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Regresar al formulario de acceso
              </button>
            </form>
          )}
        </div>
      ) : (
        /* Vista: Login Normal con PIN de Superadmin Integrado */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="m@ejemplo.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="password">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true)
                  setError(null)
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                ¿Olvidé mi contraseña?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* Campo PIN Superadmin: Se muestra automáticamente si es Superadmin o si se activa */}
          {isSuperAdminEmail && (
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/90 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-900 flex items-center gap-1.5" htmlFor="pin">
                  <KeyRound className="h-3.5 w-3.5 text-purple-600" />
                  <span>PIN de Autorización Superadmin</span>
                </label>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                  4 dígitos
                </span>
              </div>
              <div className="relative">
                <input
                  id="pin"
                  name="pin"
                  type="password"
                  maxLength={6}
                  value={superadminPin}
                  onChange={(e) => setSuperadminPin(e.target.value)}
                  placeholder="•••• (PIN inicial: 2026)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-sm font-mono tracking-widest text-slate-900 placeholder:text-purple-300 placeholder:tracking-normal focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all shadow-sm"
                />
              </div>
              <p className="text-[10px] text-purple-600 font-medium leading-tight">
                Autorización directa: Serás redirigido directamente a la Consola de Administración.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Iniciar Sesión
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-center text-xs text-slate-500 pt-1">
            ¿No tienes una cuenta aún?{" "}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
              Regístrate gratis
            </Link>
          </div>
        </form>
      )}

      {/* 3. Footer de Autenticación Estandarizado Tech Innova */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center text-center space-y-4">
        
        {/* Identidad de la Empresa Desarrolladora */}
        <div className="flex flex-col items-center space-y-1.5">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Desarrollado y Respaldado por
          </span>
          <div className="relative h-7 w-32 opacity-85 hover:opacity-100 transition-opacity">
            <Image
              src="/brand/tech-innova.png"
              alt="Tech Innova Logo"
              fill
              className="object-contain"
            />
          </div>
          <a
            href="mailto:tech.innova.reg@gmail.com"
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-indigo-500" />
            tech.innova.reg@gmail.com
          </a>
        </div>

        {/* Botón Flotante/Menú de Soporte Técnico */}
        <div className="w-full relative">
          <button
            type="button"
            onClick={() => setShowSupportMenu(!showSupportMenu)}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between transition-colors shadow-sm"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-indigo-600" />
              ¿Necesitas ayuda o soporte técnico?
            </span>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showSupportMenu ? "rotate-180" : ""}`} />
          </button>

          {showSupportMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-900/10 space-y-1.5 text-left z-20 animate-in fade-in slide-in-from-bottom-2">
              <a
                href="https://wa.me/51912440927?text=Hola%20Tech%20Innova,%20necesito%20ayuda%20para%20acceder%20a%20mi%20cuenta%20de%20ControlTotal."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors text-xs font-semibold"
              >
                <div className="h-7 w-7 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <div>Contactar por WhatsApp</div>
                  <div className="text-[10px] text-slate-400 font-normal">Respuesta inmediata de Tech Innova</div>
                </div>
              </a>

              <a
                href="mailto:tech.innova.reg@gmail.com?subject=Soporte%20Acceso%20ControlTotal"
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 transition-colors text-xs font-semibold"
              >
                <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div>Enviar Correo de Soporte</div>
                  <div className="text-[10px] text-slate-400 font-normal">tech.innova.reg@gmail.com</div>
                </div>
              </a>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
