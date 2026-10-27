"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { 
  Loader2, Mail, Lock, User, ArrowRight, ShieldCheck, 
  HelpCircle, MessageCircle, ChevronDown
} from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [showSupportMenu, setShowSupportMenu] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-indigo-950/10 p-7 sm:p-9 text-slate-800">
      
      {/* 1. Header con Logo de ControlTotal */}
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
          Crea tu Cuenta Gratis
        </h1>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Comienza hoy mismo a tomar el control absoluto de tus finanzas y gastos
        </p>
      </div>

      {/* 2. Formulario de Registro */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5" htmlFor="fullName">
            Nombre Completo
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              disabled={loading}
              placeholder="Juan Pérez"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

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
              placeholder="m@ejemplo.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5" htmlFor="password">
            Contraseña Segura
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={loading}
              placeholder="Mínimo 6 caracteres"
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
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Crear Cuenta Gratuita
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="text-center text-xs text-slate-500 pt-1">
          ¿Ya tienes una cuenta creada?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
            Inicia sesión aquí
          </Link>
        </div>
      </form>

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
                href="https://wa.me/51912440927?text=Hola%20Tech%20Innova,%20necesito%20ayuda%20para%20crear%20mi%20cuenta%20de%20ControlTotal."
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
                href="mailto:tech.innova.reg@gmail.com?subject=Soporte%20Registro%20ControlTotal"
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
