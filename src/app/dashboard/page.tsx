"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { useCategories, Category } from "@/hooks/useCategories"
import { motion, Variants } from "framer-motion"

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { CreditCard, Banknote, Landmark, AlertCircle, Loader2, Target, PiggyBank, ShieldAlert, ArrowRight } from "lucide-react"
import { usePayments } from "@/hooks/usePayments"
import { useIncomes } from "@/hooks/useIncomes"
import { useAccounts } from "@/hooks/useAccounts"
import { useDebts } from "@/hooks/useDebts"
import { useSavings } from "@/hooks/useSavings"
import { useCurrency } from "@/hooks/useCurrency"
import { formatCurrency } from "@/lib/currency"
import { TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6"]

// Funciones de animación
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function DashboardPage() {
  const supabase = createClient()
  const [isSuper, setIsSuper] = React.useState(false)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (
        session?.user?.email === "tech.innova.reg@gmail.com" || 
        session?.user?.email === "carlos.amambal@gmail.com"
      ) {
        setIsSuper(true)
      }
    })
  }, [supabase])

  const { payments, loading: loadingPayments } = usePayments()
  const { incomes, loading: loadingIncomes } = useIncomes()
  const { accounts, loading: loadingAccounts } = useAccounts()
  const { debts, loading: loadingDebts } = useDebts()
  const { goals, loading: loadingSavings } = useSavings() // <--- NEW!
  const { categories } = useCategories()
  const { currency, rates } = useCurrency()

  const loading = loadingPayments || loadingIncomes || loadingAccounts || loadingDebts || loadingSavings

  // 1. Calcular métricas resumidas
  const stats = React.useMemo(() => {
    // [Same logic as before]
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const aPagarMes = payments
      .filter(p => {
        const dueDate = new Date(p.due_date)
        return p.status === "pendiente" && 
               dueDate.getMonth() === currentMonth && 
               dueDate.getFullYear() === currentYear
      })
      .reduce((sum, p) => sum + p.amount, 0)

    const ingresosMes = incomes
      .filter(i => {
        const date = new Date(i.date)
        return i.status === "recibido" &&
               date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear
      })
      .reduce((sum, i) => sum + i.amount, 0)

    const gastosMesPagados = payments
      .filter(p => {
        const date = new Date(p.due_date)
        return p.status === "pagado" &&
               date.getMonth() === currentMonth &&
               date.getFullYear() === currentYear
      })
      .reduce((sum, p) => sum + p.amount, 0)

    const balanceMes = ingresosMes - gastosMesPagados

    const deudasPendientes = debts.reduce((sum, d) => sum + d.remaining_amount, 0)
    const pagosVencidosCount = payments.filter(p => p.status === "vencido").length

    return {
      aPagarMes,
      ingresosMes,
      balanceMes,
      deudasPendientes,
      cuentasActivas: accounts.length,
      pagosVencidosCount
    }
  }, [payments, incomes, debts, accounts])

  // 2. Datos para el gráfico de barras (Últimos 6 meses)
  const dataGastos = React.useMemo(() => {
    // [Same logic]
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const last6Months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthLabel = months[d.getMonth()]
      const monthKey = d.toISOString().substring(0, 7) // YYYY-MM
      
        const totalInBase = payments
          .filter(p => p.due_date.startsWith(monthKey) && p.status === "pagado")
          .reduce((sum, p) => sum + p.amount, 0)
        
        const total = currency === "PEN" ? totalInBase : totalInBase * (rates[currency] || 1)
        last6Months.push({ name: monthLabel, total })
    }
    return last6Months
  }, [payments, currency, rates])

  // 3. Datos para el gráfico de torta 
  const dataCategorias = React.useMemo(() => {
    const now = new Date()
    const monthKey = now.toISOString().substring(0, 7)
    const categoryTotals = new Map<string, { value: number; color: string | null }>()
    
    payments
      .filter(p => p.due_date.startsWith(monthKey))
      .forEach(p => {
        const cat = categories.find((c: Category) => c.id === p.category_id)
        const name = cat ? cat.name : "Otros"
        const color = cat ? cat.color : "#71717a"
        
        const existing = categoryTotals.get(name) || { value: 0, color }
        categoryTotals.set(name, { 
          value: existing.value + p.amount, 
          color 
        })
      })

    return Array.from(categoryTotals.entries()).map(([name, data]) => {
      const convertedValue = currency === "PEN" ? data.value : data.value * (rates[currency] || 1)
      return { name, value: Number(convertedValue.toFixed(2)), color: data.color }
    })
  }, [payments, categories, currency, rates])

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
            <Loader2 className="h-10 w-10 text-primary" />
        </motion.div>
        <p className="text-muted-foreground animate-pulse">Cargando métricas financieras...</p>
      </div>
    )
  }

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 pb-20 overflow-x-hidden"
    >
      {isSuper && (
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-purple-50 border border-purple-200/90 text-xs shadow-sm">
          <div className="flex items-center gap-2 text-purple-900 font-bold">
            <ShieldAlert className="h-4 w-4 text-purple-600 shrink-0" />
            <span>Consola Superadmin: Estás visualizando tu cuenta personal de control de gastos.</span>
          </div>
          <Link href="/dashboard/admin" className="font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 shrink-0 bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-sm transition-colors">
            <span>Ir a Administración de Cuentas</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Resumen Financiero</h2>
        <p className="text-muted-foreground">Tu estado general de cuentas y ahorros este mes.</p>
      </motion.div>

      {/* KPIs Principales */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards... same as before but inside motion.div item */}
        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="premium-card h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                A Pagar Este Mes
                </CardTitle>
                <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.aPagarMes, currency, rates)}</div>
                <p className="text-xs text-muted-foreground">Pagos pendientes programados</p>
            </CardContent>
            </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="premium-card border-emerald-500/20 bg-emerald-500/5 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-500">
                Balance del Mes
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
                <div className={cn(
                "text-2xl font-bold",
                stats.balanceMes >= 0 ? "text-emerald-400" : "text-destructive"
                )}>
                {formatCurrency(stats.balanceMes, currency, rates)}
                </div>
                <p className="text-xs text-muted-foreground">Utilidad neta (Ingresos - Gastos)</p>
            </CardContent>
            </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="premium-card h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                Deudas Pendientes
                </CardTitle>
                <Banknote className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-amber-500">{formatCurrency(stats.deudasPendientes, currency, rates)}</div>
                <p className="text-xs text-muted-foreground">Dinero que te deben cobrar</p>
            </CardContent>
            </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className={cn(
            "premium-card transition-colors h-full",
            stats.pagosVencidosCount > 0 ? "border-destructive/20 bg-destructive/5" : ""
            )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={cn(
                "text-sm font-medium",
                stats.pagosVencidosCount > 0 ? "text-destructive" : "text-muted-foreground"
                )}>
                Pagos Vencidos
                </CardTitle>
                <AlertCircle className={cn(
                "h-4 w-4",
                stats.pagosVencidosCount > 0 ? "text-destructive" : "text-muted-foreground"
                )} />
            </CardHeader>
            <CardContent>
                <div className={cn(
                "text-2xl font-bold",
                stats.pagosVencidosCount > 0 ? "text-destructive" : ""
                )}>
                {stats.pagosVencidosCount}
                </div>
                <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
            </CardContent>
            </Card>
        </motion.div>
      </motion.div>

      {/* Gráficos de Resumen */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 premium-card">
          <CardHeader>
            <CardTitle>Historial de Gastos</CardTitle>
            <CardDescription>
              Comparativa de gastos pagados en los últimos 6 meses.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataGastos}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="name" 
                  stroke="#a1a1aa" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#a1a1aa" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => new Intl.NumberFormat('es-PE', { notation: 'compact' }).format(value)}
                />
                <Tooltip 
                  cursor={{fill: '#27272a', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#27272a', borderRadius: '8px' }}
                  formatter={(value: any) => [formatCurrency(value, currency, { [currency]: 1 }), "Gastado"]}
                />
                <Bar 
                  dataKey="total" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 premium-card min-w-0">
          <CardHeader>
            <CardTitle>Distribución Mensual</CardTitle>
            <CardDescription>
              Gastos por categoría este mes indicados en procentajes.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full min-w-0 overflow-hidden">
            {dataCategorias.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={dataCategorias}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dataCategorias.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#27272a', borderRadius: '8px' }}
                      formatter={(value: any) => [formatCurrency(value, currency, { [currency]: 1 }), "Monto"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                  {dataCategorias.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2 text-sm bg-accent/20 px-2 py-1 rounded-md border border-border/50">
                      <div className="h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }} />
                      <span className="text-muted-foreground font-medium">{entry.name}</span>
                      <span className="text-xs font-bold text-primary opacity-70">
                        {((entry.value / dataCategorias.reduce((s, d) => s + d.value, 0)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                Sin datos este mes
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Widget de Metas de Ahorro */}
      <motion.div variants={itemVariants} className="pt-2">
         <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
            <div>
               <h3 className="text-xl font-bold flex items-center gap-2">
                   <Target className="h-5 w-5 text-blue-500" />
                   Tus Metas de Ahorro
                </h3>
               <p className="text-sm text-muted-foreground">Seguimiento de tus proyecciones principales.</p>
            </div>
            <Link href="/dashboard/savings" className="text-sm px-4 py-2 bg-accent/50 hover:bg-accent rounded-md transition-colors font-medium">
                Gestionar Metas
            </Link>
         </div>

         {goals.length > 0 ? (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {goals.slice(0, 3).map(goal => {
                    const currentC = currency === "PEN" ? goal.current_amount : goal.current_amount * (rates[currency] || 1)
                    const targetC = currency === "PEN" ? goal.target_amount : goal.target_amount * (rates[currency] || 1)
                    const p = Math.min((currentC / targetC) * 100, 100)
                    const completed = p >= 100 || goal.status === 'completada'

                    return (
                        <motion.div key={goal.id} whileHover={{ y: -4 }}>
                            <Card className="premium-card overflow-hidden">
                                <CardContent className="p-4 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-semibold text-lg max-w-[80%] truncate" title={goal.name}>{goal.name}</div>
                                        <div className="p-1 px-2 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${goal.color || '#3b82f6'}20`, color: goal.color || "#3b82f6"}}>
                                            {p.toFixed(0)}%
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                           <span>{formatCurrency(currentC, currency, { [currency]: 1 })}</span>
                                           <span>{formatCurrency(targetC, currency, { [currency]: 1 })}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                                           <motion.div 
                                              initial={{ width: 0 }}
                                              animate={{ width: `${p}%` }}
                                              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                              className="h-full rounded-full" 
                                              style={{ backgroundColor: goal.color || "#3b82f6" }}
                                            />
                                        </div>
                                    </div>
                                    {completed && <div className="mt-2 text-xs font-semibold text-green-500">¡Meta Alcanzada!</div>}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
             </div>
         ) : (
             <div className="p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center">
                 <PiggyBank className="h-10 w-10 text-muted-foreground mb-3" />
                 <h4 className="font-semibold mb-1">Empieza a Ahorrar</h4>
                 <p className="text-sm text-muted-foreground mb-4 max-w-sm">No tienes ninguna meta activa actualmente. Diseña proyectos a futuro y apártales dinero.</p>
                 <Link href="/dashboard/savings" className="px-4 py-2 border border-blue-500 text-blue-500 hover:bg-blue-500/10 rounded-md font-medium text-sm transition-colors">
                     Crear mi primera Meta
                 </Link>
             </div>
         )}
      </motion.div>

    </motion.div>
  )
}
