"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Globe, ArrowUpRight, ShieldCheck, Smartphone, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-slate-50 text-slate-800 overflow-hidden">
      {/* Sutil resplandor de fondo estilo Pixer */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none translate-y-1/2" />

      {/* Franja superior de marca Tech Innova */}
      <div className="border-b border-slate-200/80 bg-white/70 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-44">
                <Image
                  src="/brand/tech-innova.png"
                  alt="Tech Innova Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              <span className="text-xs text-slate-500 tracking-wider uppercase hidden sm:inline-block font-semibold">
                Desarrollo de Software & Soluciones Cloud
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Sistemas en Operación 2026
              </span>
              <a
                href="https://tech-innova.online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-indigo-600" />
                tech-innova.online
                <ArrowUpRight className="h-3 w-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bloque principal del Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Columna 1 & 2: Identidad Tech Innova y ControlTotal */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9">
                <Image
                  src="/brand/controltotal-icon.svg"
                  alt="ControlTotal Icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Control<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Total</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Plataforma financiera integral para la gestión automatizada de pagos, ingresos, deudas por cobrar y metas de ahorro. Desarrollada por <strong className="text-slate-900 font-semibold">Tech Innova</strong> con arquitectura escalable y seguridad de nivel empresarial.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-sm text-slate-700">
              <a
                href="mailto:tech.innova.reg@gmail.com"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-semibold"
              >
                <Mail className="h-4 w-4" />
                tech.innova.reg@gmail.com
              </a>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Cifrado SSL de 256 bits y políticas de RLS en base de datos
              </p>
            </div>
          </div>

          {/* Columna 3: Ecosistema Tech Innova */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Ecosistema Tech Innova</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <span className="text-slate-900 font-medium flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-emerald-600" />
                  ControlTotal Android
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">Pronto</span>
                </span>
              </li>
              <li>
                <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  Labora Platform
                  <ArrowUpRight className="h-3 w-3 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  WishiGo Solutions
                  <ArrowUpRight className="h-3 w-3 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Navegación Rápida */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Plataforma</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <a href="#features" className="hover:text-indigo-600 transition-colors">Funcionalidades</a>
              </li>
              <li>
                <a href="#android" className="hover:text-indigo-600 transition-colors">Versión Android</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-indigo-600 transition-colors">Planes y Precios</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-indigo-600 transition-colors">Contacto & Soporte</a>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">Acceso Clientes</Link>
              </li>
            </ul>
          </div>

          {/* Columna 5: Canales y Contacto */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Canales Directos</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Atención y soporte corporativo de Tech Innova para la plataforma ControlTotal.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { name: "Web Oficial", href: "https://tech-innova.online", icon: Globe },
                { name: "GitHub", href: "https://github.com/techinnovareg-lgtm", icon: Sparkles },
                { name: "Email", href: "mailto:tech.innova.reg@gmail.com", icon: Mail },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm transition-all flex items-center gap-1.5 text-xs font-medium"
                >
                  <item.icon className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Barra inferior de derechos y términos */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 <strong className="text-slate-800 font-semibold">Tech Innova</strong>. Proyecto <strong className="text-slate-800 font-semibold">ControlTotal</strong>. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 transition-colors">
              Términos de Servicio
            </a>
            <span className="text-slate-300">•</span>
            <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 transition-colors">
              Política de Privacidad
            </a>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600 font-semibold">v2.5 Producción</span>
          </div>
        </div>
      </div>
    </footer>
  )
}


// ==============================================================
// BANNER COMPACTO Y SIMPLE PARA EL DASHBOARD
// ==============================================================
export function DashboardFooter() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/95 backdrop-blur-sm py-2 px-4 sm:px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Tech Innova</span>
          <span className="text-slate-300">•</span>
          <span>ControlTotal v2.5</span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Nube Segura
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-slate-500">
          <a href="mailto:tech.innova.reg@gmail.com" className="hover:text-indigo-600 transition-colors">
            Soporte: tech.innova.reg@gmail.com
          </a>
          <span className="text-slate-300">•</span>
          <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
            tech-innova.online
          </a>
          <span className="text-slate-300">•</span>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  )
}
