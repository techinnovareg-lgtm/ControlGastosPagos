"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Globe, ArrowUpRight, ShieldCheck, Smartphone, KeyRound, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#04060A] text-white overflow-hidden">
      {/* Glow ambiental */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none translate-y-1/2" />

      {/* Franja superior de marca Tech Innova */}
      <div className="border-b border-white/5 bg-white/[0.01] py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-11 w-44">
                <Image
                  src="/brand/tech-innova.png"
                  alt="Tech Innova Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <span className="text-xs text-white/60 tracking-wider uppercase hidden sm:inline-block font-medium">
                Desarrollo de Software & Soluciones Cloud
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sistemas en Operación 2026
              </span>
              <a
                href="https://tech-innova.online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-cyan-400" />
                tech-innova.online
                <ArrowUpRight className="h-3 w-3 opacity-60" />
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
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                CT
              </div>
              <span className="text-xl font-bold tracking-tight">
                Control<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Total</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Plataforma financiera integral para la gestión automatizada de pagos, ingresos, deudas por cobrar y metas de ahorro. Desarrollada por <strong className="text-white font-semibold">Tech Innova</strong> con arquitectura escalable y seguridad de nivel empresarial.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-sm text-white/70">
              <a
                href="mailto:tech.innova.reg@gmail.com"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Mail className="h-4 w-4" />
                tech.innova.reg@gmail.com
              </a>
              <p className="text-xs text-white/50 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Cifrado SSL de 256 bits y políticas de RLS en base de datos
              </p>
            </div>
          </div>

          {/* Columna 3: Ecosistema Tech Innova */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">Ecosistema Tech Innova</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <span className="text-white/90 font-medium hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                  NovaKey Sync
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Móvil</span>
                </span>
              </li>
              <li>
                <span className="text-white/90 font-medium hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-indigo-400" />
                  ControlTotal Android
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Próx.</span>
                </span>
              </li>
              <li>
                <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  Labora Platform
                  <ArrowUpRight className="h-3 w-3 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  WishiGo Solutions
                  <ArrowUpRight className="h-3 w-3 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Navegación Rápida */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">Plataforma</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
              </li>
              <li>
                <a href="#android" className="hover:text-white transition-colors">App Móvil & NovaKey</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">Planes y Precios</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contacto & Soporte</a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Acceso Clientes</Link>
              </li>
            </ul>
          </div>

          {/* Columna 5: Redes y Presencia Digital */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">Redes y Comunidad</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Sigue el desarrollo de nuestros proyectos y novedades tecnológicas de Tech Innova.
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
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/5 hover:border-white/20 transition-all flex items-center gap-1.5 text-xs"
                >
                  <item.icon className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Barra inferior de derechos y términos */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>
            © 2026 <strong className="text-white/80 font-medium">Tech Innova</strong>. Proyecto <strong className="text-white/80 font-medium">ControlTotal</strong>. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Términos de Servicio
            </a>
            <span className="text-white/20">•</span>
            <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Política de Privacidad
            </a>
            <span className="text-white/20">•</span>
            <span className="text-cyan-400 font-medium">v2.5 Producción</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
