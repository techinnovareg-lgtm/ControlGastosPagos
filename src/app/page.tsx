import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wallet, Shield, Zap, Calendar, TrendingUp, CheckCircle2 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-white selection:bg-primary/30">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-xl text-primary">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              Control<span className="text-white">Total</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#about" className="hover:text-white transition-colors">Nosotros</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="text-sm shadow-lg shadow-primary/20">Empezar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Background blurred circles */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl -z-10 opacity-20">
            <div className="absolute top-20 left-0 w-72 h-72 bg-primary rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600 rounded-full blur-[150px]" />
          </div>

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-indigo-300 animate-in">
              <Zap className="h-4 w-4 fill-indigo-300" />
              <span>Nueva versión 2.0 disponible</span>
            </div>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Domina tus finanzas con <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
                inteligencia y control total
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              La plataforma SaaS definitiva para gestionar tus pagos, suscripciones y deudas en un solo lugar. Toma decisiones informadas y nunca más olvides un vencimiento.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button className="h-12 px-8 text-base shadow-xl shadow-primary/25">
                  Comienza tu control ahora
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="h-12 px-8 text-base border-white/10 hover:bg-white/5 transition-all">
                  Ver Demostración
                </Button>
              </Link>
            </div>
            
            <div className="mt-20 relative max-w-5xl mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=2070" 
                        alt="Control Total Dashboard Preview" 
                        className="w-full opacity-90 group-hover:scale-[1.01] transition-transform duration-700"
                    />
                </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold sm:text-4xl">Todo lo que necesitas para tu libertad financiera</h2>
              <p className="mt-4 text-muted-foreground">Hemos diseñado la herramienta más completa pero fácil de usar.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Gestión de Pagos",
                  desc: "Controla tus pagos mensuales, suscripciones y servicios de forma centralizada.",
                  icon: Calendar,
                  color: "text-blue-400"
                },
                {
                  title: "Deudas por Cobrar",
                  desc: "Lleva el registro de quién te debe y cuándo deben pagarte con recordatorios automáticos.",
                  icon: TrendingUp,
                  color: "text-emerald-400"
                },
                {
                  title: "Alertas Inteligentes",
                  desc: "Recibe correos electrónicos antes de cada vencimiento para evitar moras.",
                  icon: Zap,
                  color: "text-amber-400"
                },
                {
                  title: "Reportes Detallados",
                  desc: "Analiza tu comportamiento de gasto con gráficos intuitivos y exportaciones en PDF/Excel.",
                  icon: Shield,
                  color: "text-violet-400"
                },
                {
                  title: "Varias Cuentas",
                  desc: "Soporte para múltiples cuentas bancarias y tarjetas de crédito con saldos reales.",
                  icon: Wallet,
                  color: "text-rose-400"
                },
                {
                  title: "Seguridad Avanzada",
                  desc: "Tus datos están protegidos con encriptación de grado militar mediante Supabase.",
                  icon: CheckCircle2,
                  color: "text-indigo-400"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/50 transition-all duration-300">
                  <div className={`mb-4 inline-flex p-3 rounded-xl bg-white/5 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="font-bold">ControlTotal</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 ControlTotal SaaS. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
