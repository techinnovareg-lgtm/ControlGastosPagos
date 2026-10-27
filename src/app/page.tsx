"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Wallet, Shield, Zap, Calendar, TrendingUp, CheckCircle2, 
  ArrowRight, Smartphone, Sparkles, Check, ChevronRight, 
  Mail, Globe, Star, ArrowUpRight, Lock, Clock, 
  CreditCard, PieChart, Layers, Send, BellRing, DownloadCloud
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

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
    <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. NAVBAR - ESTILO PIXER CLARO (GLASSMORPHISM WHITE) */}
      {/* ========================================================= */}
      <header className="fixed top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-all">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo Corporativo ControlTotal by Tech Innova */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 transition-transform group-hover:scale-105">
              <Image
                src="/brand/controltotal-icon.svg"
                alt="ControlTotal Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                Control<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">Total</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">
                by Tech Innova
              </span>
            </div>
          </Link>

          {/* Menú de Navegación Estilo Pixer */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Funcionalidades</a>
            <a href="#android" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <span>Versión Android</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">Móvil</span>
            </a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Planes & Precios</a>
            <a href="#techinnova" className="hover:text-indigo-600 transition-colors">Tech Innova</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Contacto</a>
          </nav>

          {/* Botones de Acción */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-sm px-5 py-2.5 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                <span className="relative z-10 flex items-center gap-1.5">
                  Empezar Gratis
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION - ESTILO CLARO PIXER CON BANNER 3D IA */}
      {/* ========================================================= */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
        
        {/* Efectos de fondo sutiles luminosos (Luces y gradientes Pixer) */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-100/70 via-purple-100/50 to-cyan-100/60 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-indigo-50/80 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Pill Badge Superior */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-sm shadow-indigo-100 mb-8 animate-in fade-in slide-in-from-top-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Plataforma SaaS 2026 • Creado por Tech Innova</span>
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          </div>

          {/* Gran Título en Modo Claro */}
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl max-w-5xl mx-auto text-slate-900 leading-[1.12]">
            Domina tus finanzas con <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600">
              claridad, control y precisión total
            </span>
          </h1>

          {/* Subtítulo Persuasivo */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            La plataforma inteligente de <strong className="text-slate-900 font-semibold">Tech Innova</strong> para automatizar tus pagos mensuales, proyectar metas de ahorro, controlar deudas por cobrar y erradicar las moras para siempre.
          </p>

          {/* Botones de Acción Hero */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-13 px-8 text-base font-bold rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-105 active:scale-95 transition-all duration-300">
                Comenzar Ahora Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-13 px-8 text-base font-semibold rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm hover:border-slate-300 transition-all">
                Conocer Funciones
              </Button>
            </a>
          </div>

          {/* ========================================================= */}
          {/* BANNER 3D FINTECH GENERADO POR IA (ESTILO PIXER CLARO) */}
          {/* ========================================================= */}
          <div className="mt-14 md:mt-20 relative max-w-5xl mx-auto group">
            
            {/* Sombra difusa colorida en el fondo del banner */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-[32px] blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-700" />
            
            <div className="relative rounded-2xl md:rounded-3xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-indigo-950/10 overflow-hidden">
              
              {/* Imagen 3D Ilustrativa Principal */}
              <div className="relative w-full h-[320px] sm:h-[480px] lg:h-[540px] rounded-xl md:rounded-2xl overflow-hidden bg-slate-50">
                <Image
                  src="/brand/hero-banner.jpg"
                  alt="ControlTotal 3D Fintech Visual Dashboard by Tech Innova"
                  fill
                  className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
                  priority
                />

                {/* Badges Flotantes de KPI sobre el Banner */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 text-left animate-in fade-in duration-500">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Balance Global Disponible</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    S/. 24,850.00
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
                    +12.4% este mes • 4 Cuentas
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 text-left animate-in fade-in duration-700">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                    <Zap className="h-4 w-4" />
                    <span>Alertas Predictivas Activas</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
                    Cero moras u olvidos
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Notificaciones automáticas diarias
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TRUST & STATS TICKER - TECH INNOVA RESPALDO */}
      {/* ========================================================= */}
      <section id="techinnova" className="py-14 border-y border-slate-200/80 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">
                99.98%
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">Uptime en la Nube</p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">
                0%
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">Olvidos de Vencimiento</p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                256-Bit
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">Seguridad Cifrada SSL</p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600">
                100%
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">Garantía Tech Innova</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FUNCIONALIDADES AVANZADAS (ESTILO PIXER LIGHT CARDS) */}
      {/* ========================================================= */}
      <section id="features" className="py-24 bg-slate-50/70 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-4">
              <span>Módulos de Alto Rendimiento</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Todo lo que necesitas para tu tranquilidad financiera
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
              Diseñado con arquitectura limpia para brindarte respuestas inmediatas sin recargas ni complejidades.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: "Gestión de Pagos & Suscripciones",
                desc: "Organiza tus pagos mensuales fijos, servicios del hogar y membresías en un calendario interactivo y dinámico.",
                tag: "Automatizado",
                badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
                iconColor: "text-blue-600 bg-blue-50"
              },
              {
                icon: TrendingUp,
                title: "Deudas por Cobrar & Abonos",
                desc: "Lleva el registro exacto de préstamos concedidos, cobros pendientes e historial de amortizaciones en tiempo real.",
                tag: "Finanzas Claras",
                badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                iconColor: "text-emerald-600 bg-emerald-50"
              },
              {
                icon: Sparkles,
                title: "Metas de Ahorro Inteligentes",
                desc: "Configura tus metas (fondo de emergencia, proyectos, viajes). Cada aporte descuenta de tu saldo de cuenta automáticamente.",
                tag: "Metas Futuras",
                badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
                iconColor: "text-purple-600 bg-purple-50"
              },
              {
                icon: Wallet,
                title: "Control Multicuenta & Tarjetas",
                desc: "Soporte para múltiples cuentas bancarias, billeteras digitales y tarjetas con cálculo de balance real consolidado.",
                tag: "Multicanal",
                badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
                iconColor: "text-cyan-600 bg-cyan-50"
              },
              {
                icon: Zap,
                title: "Alertas Automáticas por Email",
                desc: "Un motor programado en la nube evalúa diariamente tus compromisos y te notifica por correo electrónico antes del vencimiento.",
                tag: "Cero Olvidos",
                badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
                iconColor: "text-amber-600 bg-amber-50"
              },
              {
                icon: PieChart,
                title: "Reportes & Analítica Exportable",
                desc: "Visualiza gráficos de distribución de gastos, balances mensuales y exporta balances detallados en formatos PDF y Excel.",
                tag: "Auditoría",
                badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
                iconColor: "text-rose-600 bg-rose-50"
              }
            ].map((f, i) => (
              <div 
                key={i} 
                className="group relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl ${f.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${f.badgeColor}`}>
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {f.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors">
                  <span>Ver detalle de función</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SECCIÓN ANDROID VERSION - CON RENDER 3D IA CLARO */}
      {/* ========================================================= */}
      <section id="android" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-3xl sm:rounded-[36px] border border-slate-200/90 bg-gradient-to-br from-indigo-50/60 via-white to-cyan-50/50 p-8 sm:p-12 lg:p-16 shadow-2xl shadow-indigo-900/5 overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Columna Izquierda: Información de la Versión Android */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Smartphone className="h-4 w-4 text-emerald-600" />
                  <span>ControlTotal Versión Android</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                  Tus finanzas en la palma de tu mano con la <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">
                    App Móvil para Android
                  </span>
                </h2>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  Lleva el control de tus gastos diarios desde tu teléfono. La versión Android de ControlTotal está diseñada para ofrecerte máxima velocidad al registrar cobros y pagos en cualquier momento del día.
                </p>

                {/* Características Clave Móvil */}
                <div className="space-y-4 pt-2">
                  {[
                    { title: "Registro Ultra Rápido", desc: "Anota un gasto, pago o abono en menos de 5 segundos con interfaz intuitiva optimizada para pantalla táctil." },
                    { title: "Sincronización Cloud Automática", desc: "Tus datos registrados en la app móvil se reflejan instantáneamente en tu panel web sin recargas." },
                    { title: "Alertas y Notificaciones Móviles", desc: "Avisos directos en tu barra de notificaciones para que nunca olvides pagar a tiempo." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <strong className="text-slate-900 text-sm font-bold">{item.title}: </strong>
                        <span className="text-slate-600 text-sm font-normal">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Badges de Próximo Lanzamiento */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Próximamente en Google Play Store
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-800">
                    <DownloadCloud className="h-4 w-4 text-indigo-600" />
                    Instalador APK Directo para Clientes
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Render 3D del Smartphone Android con IA */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm sm:max-w-md h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-2xl shadow-indigo-900/10 group">
                  <Image
                    src="/brand/android-mockup.jpg"
                    alt="ControlTotal Android App 3D Mockup by Tech Innova"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 text-center text-xs font-bold text-slate-800 shadow-md">
                    📱 Experiencia Móvil Fluida y 100% Sincronizada
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. PLANES Y PRECIOS TRANSPARENTES (PRICING LIGHT PIXER) */}
      {/* ========================================================= */}
      <section id="pricing" className="py-24 bg-slate-50/70 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-4">
              <span>Tarifas Claras y Sin Sorpresas</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Planes a tu medida para maximizar tu ahorro
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Inicia sin costo y actualiza tu cuenta cuando necesites mayor capacidad y funciones pro.
            </p>

            {/* Toggle Mensual / Anual */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === "monthly" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Facturación Mensual
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Facturación Anual</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  -20% Ahorro
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
            
            {/* PLAN 1: STARTER FREE */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-9 shadow-xl shadow-slate-200/40 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Plan Personal</div>
                <h3 className="text-2xl font-black mt-1 text-slate-900">Starter Free</h3>
                <p className="text-xs text-slate-500 mt-2">Para comenzar a ordenar tus finanzas básicas sin costo.</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">S/. 0</span>
                    <span className="text-xs text-slate-500 font-medium">/ para siempre</span>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Hasta 15 pagos y gastos activos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>2 Cuentas bancarias o billeteras</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Alertas básicas por correo electrónico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Acceso completo a la plataforma web</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold">
                    Empezar Gratis
                  </Button>
                </Link>
              </div>
            </div>

            {/* PLAN 2: PRO CONTROLTOTAL (RECOMENDADO / DESTACADO) */}
            <div className="relative rounded-3xl bg-white border-2 border-indigo-600 p-8 sm:p-9 shadow-2xl shadow-indigo-600/15 flex flex-col justify-between hover:scale-[1.02] transition-all">
              
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                Plan Más Popular
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Plan Profesional</div>
                <h3 className="text-2xl font-black mt-1 text-slate-900">ControlTotal Pro</h3>
                <p className="text-xs text-slate-500 mt-2">Para personas activas, independientes y familias.</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">
                      {billingCycle === "monthly" ? "S/. 19.90" : "S/. 15.90"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ mes facturado {billingCycle === "monthly" ? "mensual" : "anual"}</span>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-800 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="h-4 w-4 text-indigo-600" />
                    <span>Pagos, ingresos y suscripciones <strong>ilimitadas</strong></span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="h-4 w-4 text-indigo-600" />
                    <span>Cuentas bancarias y tarjetas <strong>ilimitadas</strong></span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="h-4 w-4 text-indigo-600" />
                    <span>Módulo de deudas por cobrar e historial de abonos</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="h-4 w-4 text-indigo-600" />
                    <span>Metas de ahorro con descuento automático de cuenta</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="h-4 w-4 text-indigo-600" />
                    <span>Alertas predictivas diarias por correo</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="h-4 w-4 text-indigo-600" />
                    <span>Acceso anticipado a la <strong>Versión Android</strong></span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/register" className="w-full">
                  <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40">
                    Comenzar con Plan Pro
                  </Button>
                </Link>
              </div>
            </div>

            {/* PLAN 3: BUSINESS SUITE */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-9 shadow-xl shadow-slate-200/40 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Pymes y Equipos</div>
                <h3 className="text-2xl font-black mt-1 text-slate-900">Business Suite</h3>
                <p className="text-xs text-slate-500 mt-2">Para pequeños negocios y múltiples centros de costo.</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">
                      {billingCycle === "monthly" ? "S/. 59.90" : "S/. 47.90"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ mes facturado {billingCycle === "monthly" ? "mensual" : "anual"}</span>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-600" />
                    <span>Todo lo incluido en el Plan Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-600" />
                    <span>Multi-usuario y perfiles de colaboradores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-600" />
                    <span>Exportación contable avanzada en PDF y Excel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-600" />
                    <span>Soporte prioritario directo con Tech Innova</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <a href="#contact" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold">
                    Contactar Ventas
                  </Button>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. SECCIÓN CONTÁCTANOS ESTANDARIZADA TECH INNOVA CLARO */}
      {/* ========================================================= */}
      <section id="contact" className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Columna Izquierda: Información de Soporte Tech Innova */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Mail className="h-3.5 w-3.5 text-indigo-600" />
                <span>Atención & Soporte Directo</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                ¿Tienes dudas o necesitas atención personalizada?
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                En <strong className="text-slate-900 font-semibold">Tech Innova</strong> estamos listos para ayudarte a optimizar la gestión de tus finanzas o resolver cualquier consulta técnica.
              </p>

              <div className="space-y-4 pt-2 text-sm">
                
                {/* Canal Correo */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Correo Electrónico</div>
                    <a href="mailto:tech.innova.reg@gmail.com" className="font-bold text-slate-800 hover:text-indigo-600 transition-colors">
                      tech.innova.reg@gmail.com
                    </a>
                  </div>
                </div>

                {/* Canal Web Corporativa */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-cyan-600 shadow-sm shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Portal Tech Innova</div>
                    <a href="https://tech-innova.online" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-1">
                      https://tech-innova.online
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Canal WhatsApp */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                  <div className="h-10 w-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-sm shrink-0">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-800 font-bold">Chat de WhatsApp</div>
                    <a 
                      href="https://wa.me/51912440927?text=Hola%20Tech%20Innova,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20ControlTotal" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      +51 912 440 927 (Atención Inmediata)
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Columna Derecha: Formulario de Contacto */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-10 shadow-xl shadow-slate-200/50 relative">
                
                {contactSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                      <Check className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">¡Mensaje Enviado con Éxito!</h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto font-normal">
                      Gracias por escribirnos. Un asesor de Tech Innova revisará tu mensaje y te contactará a la brevedad.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="text-xl font-black text-slate-900 mb-1">Escríbenos tu Consulta</h3>
                    <p className="text-xs text-slate-500 mb-6">Completa los campos a continuación y te responderemos hoy mismo.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Tu nombre o empresa"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Correo Electrónico</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="ejemplo@correo.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Asunto</label>
                      <input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Mensaje o Requerimiento</label>
                      <textarea
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Escribe aquí tu consulta o requerimiento específico..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center justify-center gap-2"
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
      {/* 8. FOOTER ESTANDARIZADO TECH INNOVA CLARO */}
      {/* ========================================================= */}
      <Footer />

      {/* ========================================================= */}
      {/* 9. BOTÓN FLOTANTE DE WHATSAPP (SOPORTE TECH INNOVA) */}
      {/* ========================================================= */}
      <WhatsAppButton />

    </div>
  )
}
