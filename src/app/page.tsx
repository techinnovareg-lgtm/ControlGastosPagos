"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Wallet, Shield, Zap, Calendar, TrendingUp, CheckCircle2, 
  ArrowRight, Smartphone, KeyRound, Sparkles, Check, 
  ChevronRight, Mail, Globe, Star, ArrowUpRight, Lock, 
  Clock, CreditCard, PieChart, Layers, Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly")
  const [contactSubmitted, setContactSubmitted] = React.useState(false)
  const [contactForm, setContactForm] = React.useState({
    name: "",
    email: "",
    subject: "Consulta sobre ControlTotal",
    message: ""
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setContactSubmitted(true)
    setTimeout(() => {
      setContactSubmitted(false)
      setContactForm({ name: "", email: "", subject: "Consulta sobre ControlTotal", message: "" })
    }, 5000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#05070E] text-white selection:bg-indigo-500/30 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. NAVBAR - HEADER ESTILO PIXER GLASSMORPHISM */}
      {/* ========================================================= */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#05070E]/80 backdrop-blur-xl transition-all">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Tech Innova Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-cyan-500/30 transition-all duration-300">
                <div className="h-full w-full bg-[#070A14] rounded-[10px] flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight">
                  Control<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">Total</span>
                </span>
                <span className="text-[10px] text-white/50 tracking-wider uppercase font-semibold">
                  by Tech Innova
                </span>
              </div>
            </Link>
          </div>

          {/* Menú de Navegación */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Funcionalidades</a>
            <a href="#android" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <span>App Android</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">NovaKey</span>
            </a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Planes y Precios</a>
            <a href="#techinnova" className="hover:text-cyan-400 transition-colors">Tech Innova</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contacto</a>
          </nav>

          {/* Acciones de Login / Registro */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5">
                Acceso Clientes
              </Button>
            </Link>
            <Link href="/register">
              <Button className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-sm px-5 py-2.5 shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-white/20">
                <span className="relative z-10 flex items-center gap-1.5">
                  Comenzar Gratis
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION - INSPIRACIÓN PIXER / HIGH-CONVERTING */}
      {/* ========================================================= */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Orbes y luces ambientales */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-600/20 rounded-full blur-[160px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />

        {/* Patrón de malla sutil de fondo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-sm shadow-indigo-500/20 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Ecosistema Tech Innova 2026 • Plataforma SaaS v2.5</span>
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
          </div>

          {/* Gran Título */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl max-w-5xl mx-auto leading-[1.12]">
            Domina tus finanzas con <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300">
              precisión, control y sincronización total
            </span>
          </h1>

          {/* Subtítulo persuasivo */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed font-light">
            La solución definitiva creada por <strong className="text-white font-medium">Tech Innova</strong> para automatizar el control de pagos recurrentes, gestionar deudas por cobrar, proyectar metas de ahorro y eliminar cobros sorpresa.
          </p>

          {/* Botones de Acción */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-13 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20">
                Iniciar Prueba Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-13 px-8 text-base font-medium rounded-xl border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white transition-all backdrop-blur-md">
                Ver Funcionalidades
              </Button>
            </a>
          </div>

          {/* ========================================================= */}
          {/* MOCKUP INTERACTIVO DEL DASHBOARD ESTILO PIXER */}
          {/* ========================================================= */}
          <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto group">
            {/* Glow perimetral del marco */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700" />
            
            <div className="relative rounded-2xl md:rounded-3xl border border-white/15 bg-[#090D1A]/90 p-4 sm:p-6 lg:p-8 backdrop-blur-2xl shadow-2xl text-left">
              
              {/* Barra superior del Mockup */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs text-white/50 font-mono hidden sm:inline-block">
                    https://controltotal.tech-innova.online/dashboard
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Supabase Cloud Sync: Activo
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[11px] font-semibold text-indigo-300">
                    <KeyRound className="h-3 w-3 text-cyan-400" />
                    NovaKey Link
                  </div>
                </div>
              </div>

              {/* Contenido Visual del Mockup */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                
                {/* Tarjeta 1: Balance Total */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                    <span>Balance Global Disponible</span>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white">S/. 24,850.00</div>
                  <div className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                    <span>+12.4% este mes</span>
                    <span className="text-white/40">• 4 cuentas activas</span>
                  </div>
                </div>

                {/* Tarjeta 2: Pagos y Vencimientos */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                    <span>Alertas de Pago Inminentes</span>
                    <Calendar className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white">3 Próximos</div>
                  <div className="text-xs text-amber-300 font-medium mt-1 flex items-center gap-1">
                    <span>Servicios & Tarjetas</span>
                    <span className="text-white/40">• Recordatorio por email listo</span>
                  </div>
                </div>

                {/* Tarjeta 3: Meta de Ahorro */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                    <span>Meta: Fondo de Emergencia</span>
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white">85% Completado</div>
                  <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full w-[85%]" />
                  </div>
                </div>
              </div>

              {/* Fila inferior de transacciones simuladas */}
              <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <div className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">
                  Últimos Movimientos Reconciliados
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Suscripción Cloud AWS & Supabase", cat: "Servicios Tech", monto: "-S/. 145.00", status: "Pagado", color: "text-rose-400" },
                    { name: "Cobro Amortización Préstamo Dev", cat: "Deudas por Cobrar", monto: "+S/. 1,200.00", status: "Recibido", color: "text-emerald-400" },
                    { name: "Aporte Automático Meta Vacaciones", cat: "Ahorros", monto: "+S/. 500.00", status: "Sincronizado", color: "text-cyan-400" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="h-2 w-2 rounded-full bg-indigo-400" />
                        <div>
                          <div className="font-medium text-white">{item.name}</div>
                          <div className="text-white/40 text-[10px]">{item.cat}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-semibold ${item.color}`}>{item.monto}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/70 border border-white/10">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TRUST & STATS TICKER - TECH INNOVA POWERED */}
      {/* ========================================================= */}
      <section id="techinnova" className="py-12 border-y border-white/10 bg-white/[0.01]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                99.98%
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1 font-medium">Disponibilidad en la Nube</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                0%
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1 font-medium">Olvidos de Pagos o Moras</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                256-Bit
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1 font-medium">Cifrado de Seguridad Bancaria</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                100%
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1 font-medium">Desarrollo Tech Innova</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FUNCIONALIDADES AVANZADAS (ESTILO PIXER CARDS) */}
      {/* ========================================================= */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <span>Capacidades del Sistema</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Diseñado para el control absoluto de tus ingresos y gastos
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/60">
              Cada módulo resuelve un cuello de botella real de tus finanzas cotidianas con automatizaciones inteligentes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: "Gestor de Pagos y Suscripciones",
                desc: "Organiza tus pagos mensuales fijos, servicios básicos y suscripciones digitales con calendario interactivo y estados en tiempo real.",
                tag: "Automatizado",
                glow: "group-hover:border-indigo-500/50"
              },
              {
                icon: TrendingUp,
                title: "Deudas por Cobrar y Abonos",
                desc: "Registra préstamos concedidos y amortizaciones con cálculo dinámico de saldo pendiente e historial de cobros.",
                tag: "Financiero",
                glow: "group-hover:border-cyan-500/50"
              },
              {
                icon: Sparkles,
                title: "Metas de Ahorro Inteligentes",
                desc: "Crea fondos de emergencia y proyectos personales. Cada aporte descuenta automáticamente de la cuenta seleccionada.",
                tag: "Proyección",
                glow: "group-hover:border-violet-500/50"
              },
              {
                icon: Wallet,
                title: "Multicuentas y Tarjetas",
                desc: "Administra cuentas de ahorro, billeteras digitales y tarjetas de crédito con conciliación automática de saldos reales.",
                tag: "Multicanal",
                glow: "group-hover:border-emerald-500/50"
              },
              {
                icon: Zap,
                title: "Alertas Predictivas por Email",
                desc: "Un motor automatizado ejecutado diariamente evalúa tus vencimientos y te notifica por correo electrónico antes del corte.",
                tag: "Vercel Cron",
                glow: "group-hover:border-amber-500/50"
              },
              {
                icon: PieChart,
                title: "Reportes y Exportación Contable",
                desc: "Visualiza gráficos de distribución de gastos, balances netos y descarga reportes en PDF y Excel para auditoría personal.",
                tag: "Analytics",
                glow: "group-hover:border-rose-500/50"
              }
            ].map((f, i) => (
              <div 
                key={i} 
                className={`group relative p-8 rounded-2xl bg-[#090D1A]/60 border border-white/10 ${f.glow} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 backdrop-blur-xl flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 group-hover:scale-110 group-hover:bg-indigo-600/20 group-hover:text-white transition-all duration-300">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/5">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-indigo-400 group-hover:text-cyan-300 transition-colors">
                  <span>Explorar capacidad</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SHOWCASE: APP ANDROID & PROTOCOLO NOVAKEY */}
      {/* ========================================================= */}
      <section id="android" className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-indigo-500/20 bg-[#090E1F]/90 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
            
            {/* Luces y resplandores internos */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Lado Izquierdo: Descripción y protocolo NovaKey */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  <Smartphone className="h-4 w-4 text-cyan-400" />
                  <span>Movilidad & Sincronización Segura</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  Lleva el control en tu bolsillo con la <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400">
                    App Android y NovaKey Sync
                  </span>
                </h2>

                <p className="text-base sm:text-lg text-white/70 leading-relaxed font-light">
                  Próximamente disponible para dispositivos móviles Android. Diseñada con arquitectura nativa y sincronizada en tiempo real mediante el protocolo de autenticación y cifrado <strong className="text-white font-medium">NovaKey</strong> de Tech Innova.
                </p>

                {/* Características clave de la versión Android */}
                <div className="space-y-3.5 pt-2">
                  {[
                    { title: "Protocolo NovaKey", desc: "Llave criptográfica para sincronizar tus finanzas entre la web y tu smartphone sin compartir contraseñas." },
                    { title: "Notificaciones Push Nativas", desc: "Alertas instantáneas 24 horas antes del vencimiento de tus cuotas y tarjetas." },
                    { title: "Modo Offline Instantáneo", desc: "Registra gastos o abonos sin internet; se sincronizarán al recuperar conectividad." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <strong className="text-white text-sm font-semibold">{item.title}: </strong>
                        <span className="text-white/60 text-sm">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Badges de descarga y estado */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/90">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    En Fase Final de Pulido y Testing
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/90">
                    <KeyRound className="h-4 w-4 text-cyan-400" />
                    Sincronización NovaKey Ready
                  </div>
                </div>
              </div>

              {/* Lado Derecho: Simulación Mockup Celular */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-[280px] sm:w-[310px] h-[580px] bg-[#070A14] rounded-[45px] p-3 border-4 border-white/15 shadow-2xl shadow-indigo-500/20 ring-1 ring-white/20">
                  {/* Isla dinámica / bocina del celular */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/40" />
                  </div>

                  {/* Pantalla del teléfono */}
                  <div className="h-full w-full rounded-[38px] bg-[#0A0E1A] overflow-hidden flex flex-col p-4 pt-10 text-white">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-[10px] text-white/50 uppercase font-semibold">Bienvenido a</div>
                        <div className="text-base font-bold">ControlTotal App</div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <KeyRound className="h-4 w-4 text-cyan-400" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-cyan-500/20 border border-white/10 mb-4">
                      <div className="text-[11px] text-white/70">Balance en Mano</div>
                      <div className="text-xl font-extrabold mt-1">S/. 24,850.00</div>
                      <div className="text-[10px] text-emerald-400 mt-1">● Sincronizado con Supabase</div>
                    </div>

                    <div className="text-[11px] font-semibold text-white/60 mb-2">PRÓXIMAS CUOTAS</div>
                    <div className="space-y-2 flex-1">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-semibold">Servicio de Internet</div>
                          <div className="text-[10px] text-white/40">Vence mañana</div>
                        </div>
                        <span className="font-bold text-rose-400">S/. 120.00</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-semibold">Tarjeta Crédito Oro</div>
                          <div className="text-[10px] text-white/40">Vence en 4 días</div>
                        </div>
                        <span className="font-bold text-rose-400">S/. 450.00</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-2">
                      <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-center text-xs font-bold shadow-lg">
                        NovaKey: Dispositivo Seguro
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. PLANES Y PRECIOS TRANSPARENTES (PRICING) */}
      {/* ========================================================= */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-4">
              <span>Inversión Clara & Sin Letras Chicas</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Planes flexibles adaptados a tu ritmo financiero
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/60">
              Comienza sin costo y escala cuando necesites sincronización multi-cuenta y características avanzadas.
            </p>

            {/* Selector de facturación mensual / anual */}
            <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  billingCycle === "monthly" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Facturación Mensual
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span>Facturación Anual</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[10px] font-bold">
                  -20% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
            
            {/* PLAN 1: BÁSICO / STARTER */}
            <div className="rounded-3xl bg-[#090D1A]/70 border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white/60">Plan Personal</div>
                <h3 className="text-2xl font-bold mt-1 text-white">Starter Free</h3>
                <p className="text-xs text-white/50 mt-2">Para quienes inician el orden de sus gastos básicos.</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">S/. 0</span>
                    <span className="text-xs text-white/50">/ para siempre</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-white/70 pt-2 border-t border-white/10">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Hasta 15 pagos y gastos registrados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>2 Cuentas bancarias o billeteras</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Alertas básicas por correo electrónico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Acceso web completo y responsive</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold">
                    Empezar Gratis
                  </Button>
                </Link>
              </div>
            </div>

            {/* PLAN 2: PRO CONTROLTOTAL (RECOMENDADO) */}
            <div className="relative rounded-3xl bg-gradient-to-b from-indigo-950/80 to-[#0A0F24]/90 border-2 border-indigo-500/50 p-8 flex flex-col justify-between shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] transition-all">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                Más Elegido
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">Plan Profesional</div>
                <h3 className="text-2xl font-bold mt-1 text-white">ControlTotal Pro</h3>
                <p className="text-xs text-white/60 mt-2">Para profesionales, familias e independientes con finanzas activas.</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      {billingCycle === "monthly" ? "S/. 19.90" : "S/. 15.90"}
                    </span>
                    <span className="text-xs text-white/50">/ mes facturado {billingCycle === "monthly" ? "mensual" : "anual"}</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-white/80 pt-2 border-t border-white/10">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>Pagos, ingresos y suscripciones <strong>ilimitadas</strong></span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>Cuentas bancarias y tarjetas <strong>ilimitadas</strong></span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>Módulo de deudas por cobrar y amortizaciones</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>Metas de ahorro con balance automático</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>Acceso anticipado a la <strong>App Android & NovaKey</strong></span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>Motor Vercel Cron de alertas diarias</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/register" className="w-full">
                  <Button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-cyan-500/40">
                    Obtener Plan Pro
                  </Button>
                </Link>
              </div>
            </div>

            {/* PLAN 3: BUSINESS / ENTERPRISE */}
            <div className="rounded-3xl bg-[#090D1A]/70 border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white/60">Pymes & Equipos</div>
                <h3 className="text-2xl font-bold mt-1 text-white">Business Suite</h3>
                <p className="text-xs text-white/50 mt-2">Para pequeñas empresas, socios y múltiples entidades de gasto.</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      {billingCycle === "monthly" ? "S/. 59.90" : "S/. 47.90"}
                    </span>
                    <span className="text-xs text-white/50">/ mes facturado {billingCycle === "monthly" ? "mensual" : "anual"}</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-white/70 pt-2 border-t border-white/10">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>Todo lo incluido en el Plan Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>Multi-usuario y perfiles de colaboradores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>Exportación contable avanzada en PDF y Excel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>Sincronización multi-dispositivo NovaKey sin límite</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>Soporte prioritario directo con Tech Innova</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold">
                    Contactar Ventas
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. SECCIÓN CONTÁCTANOS ESTANDARIZADA TECH INNOVA */}
      {/* ========================================================= */}
      <section id="contact" className="py-24 border-t border-white/10 bg-white/[0.01] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Información Tech Innova */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Mail className="h-3.5 w-3.5 text-cyan-400" />
                <span>Atención & Soporte Especializado</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                ¿Tienes dudas o necesitas un desarrollo a medida?
              </h2>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
                En <strong className="text-white font-medium">Tech Innova</strong> acompañamos a nuestros clientes desde la concepción hasta el despliegue en producción de software robusto y escalable.
              </p>

              <div className="space-y-4 pt-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50">Correo Directo</div>
                    <a href="mailto:tech.innova.reg@gmail.com" className="font-semibold text-white hover:text-cyan-400 transition-colors">
                      tech.innova.reg@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50">Portal Corporativo</div>
                    <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-indigo-400 transition-colors flex items-center gap-1">
                      https://tech-innova.online
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50">Garantía de Servicio</div>
                    <div className="font-semibold text-white">Soporte técnico continuo y actualizaciones de seguridad</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Contacto Interactivo */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-[#080C1A] border border-white/15 p-8 sm:p-10 shadow-2xl relative">
                
                {contactSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                      <Check className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">¡Mensaje Enviado con Éxito!</h3>
                    <p className="text-sm text-white/60 max-w-sm mx-auto">
                      Gracias por comunicarte con el equipo de Tech Innova. Te responderemos a la brevedad.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-2">Envíanos un Mensaje</h3>
                    <p className="text-xs text-white/50 mb-6">Completa el formulario y nos pondremos en contacto contigo.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-white/70 block mb-1.5">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Tu nombre o empresa"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-white/70 block mb-1.5">Correo Electrónico</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="ejemplo@correo.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white/70 block mb-1.5">Asunto</label>
                      <input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white/70 block mb-1.5">Mensaje o Consulta</label>
                      <textarea
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Escribe aquí tu consulta o requerimiento específico..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Enviar Mensaje a Tech Innova</span>
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. FOOTER ESTANDARIZADO TECH INNOVA */}
      {/* ========================================================= */}
      <Footer />

    </div>
  )
}
