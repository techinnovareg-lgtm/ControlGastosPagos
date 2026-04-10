"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from "recharts"
import { Download, FileSpreadsheet, FileText, Loader2, Target, TrendingDown, TrendingUp } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { formatCurrency } from "@/lib/currency"
import { usePayments } from "@/hooks/usePayments"
import { useIncomes } from "@/hooks/useIncomes"
import { useCategories } from "@/hooks/useCategories"

export default function ReportsPage() {
  const { payments, loading: paymentsLoading } = usePayments()
  const { incomes, loading: incomesLoading } = useIncomes()
  const { categories, loading: categoriesLoading } = useCategories()
  
  const loading = paymentsLoading || incomesLoading || categoriesLoading
  const { currency, rates } = useCurrency()
  
  const currentYear = new Date().getFullYear().toString()
  const [selectedYear, setSelectedYear] = React.useState<string>(currentYear)

  // Los datos ya vienen de los hooks con caché. 
  // No se requiere un useEffect manual con fetch.

  // Derived Data
  const yearPayments = React.useMemo(() => payments.filter(p => p.due_date.startsWith(selectedYear)), [payments, selectedYear])
  const yearIncomes = React.useMemo(() => incomes.filter(i => i.date.startsWith(selectedYear)), [incomes, selectedYear])

  const totalPaymentsBase = yearPayments.reduce((s, p) => s + p.amount, 0)
  const totalIncomesBase = yearIncomes.reduce((s, i) => s + i.amount, 0)
  
  const totalPayments = currency === "PEN" ? totalPaymentsBase : totalPaymentsBase * (rates[currency] || 1)
  const totalIncomes = currency === "PEN" ? totalIncomesBase : totalIncomesBase * (rates[currency] || 1)
  const netProfit = totalIncomes - totalPayments

  // List of available years from data
  const availableYears = React.useMemo(() => {
    const years = new Set<string>()
    years.add(currentYear)
    payments.forEach(p => years.add(p.due_date.substring(0, 4)))
    incomes.forEach(i => years.add(i.date.substring(0, 4)))
    return Array.from(years).sort().reverse()
  }, [payments, incomes, currentYear])

  // Group by month for BarChart
  const monthlyData = React.useMemo(() => {
    const months = ["01","02","03","04","05","06","07","08","09","10","11","12"]
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    
    return months.map((m, idx) => {
      const prefix = `${selectedYear}-${m}`
      const mIncomes = yearIncomes.filter(i => i.date.startsWith(prefix)).reduce((s, i) => s + i.amount, 0)
      const mPayments = yearPayments.filter(p => p.due_date.startsWith(prefix)).reduce((s, p) => s + p.amount, 0)
      
      const convIncomes = currency === "PEN" ? mIncomes : mIncomes * (rates[currency] || 1)
      const convPayments = currency === "PEN" ? mPayments : mPayments * (rates[currency] || 1)
      
      return {
        name: monthNames[idx],
        Ingresos: Number(convIncomes.toFixed(2)),
        Gastos: Number(convPayments.toFixed(2))
      }
    })
  }, [yearIncomes, yearPayments, selectedYear, currency, rates])

  // Category Distribution (Only Payments for standard expense tracking)
  const categoryData = React.useMemo(() => {
    const map = new Map<string, number>()
    yearPayments.forEach(p => {
      const catId = p.category_id || "uncategorized"
      map.set(catId, (map.get(catId) || 0) + p.amount)
    })
    
    return Array.from(map.entries())
      .filter(([_, total]) => total > 0)
      .map(([catId, total]) => {
        const cat = categories.find(c => c.id === catId)
        const conv = currency === "PEN" ? total : total * (rates[currency] || 1)
        return {
          name: cat ? cat.name : "Sin Categoría",
          value: Number(conv.toFixed(2)),
          color: cat ? cat.color || "#6366f1" : "#a1a1aa" // default muted
        }
      })
      .sort((a,b) => b.value - a.value)
  }, [yearPayments, categories, currency, rates])

  const exportToExcel = async () => {
    const XLSX = await import("xlsx")
    
    const formatInc = yearIncomes.map(p => ({
      Nombre: p.name,
      Monto: Number((p.amount * (rates[currency] || 1)).toFixed(2)),
      Tipo: p.type,
      Fecha: p.date,
      Estado: p.status,
    }))
    
    const formatPay = yearPayments.map(p => ({
      Nombre: p.name,
      Monto: Number((p.amount * (rates[currency] || 1)).toFixed(2)),
      Tipo: p.type,
      "Fecha Vencimiento": p.due_date,
      Estado: p.status,
    }))

    const wb = XLSX.utils.book_new()
    
    if (formatInc.length > 0) {
      const wsInc = XLSX.utils.json_to_sheet(formatInc)
      XLSX.utils.book_append_sheet(wb, wsInc, "Ingresos")
    }
    
    if (formatPay.length > 0) {
      const wsPay = XLSX.utils.json_to_sheet(formatPay)
      XLSX.utils.book_append_sheet(wb, wsPay, "Gastos")
    }
    
    if (formatInc.length === 0 && formatPay.length === 0) {
        const wsEmpty = XLSX.utils.json_to_sheet([{ Mensaje: "Sin datos para este año" }])
        XLSX.utils.book_append_sheet(wb, wsEmpty, "Sin Datos")
    }

    XLSX.writeFile(wb, `reporte_anual_${selectedYear}.xlsx`)
  }

  const exportToPDF = async () => {
    const jsPDF = (await import("jspdf")).default
    const autoTable = (await import("jspdf-autotable")).default

    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text(`Reporte Financiero ${selectedYear}`, 14, 22)
    doc.setFontSize(11)
    doc.text(`Generado: ${new Date().toLocaleDateString("es")}`, 14, 30)

    let currentY = 40

    if (yearIncomes.length > 0) {
      doc.setFontSize(14)
      doc.text("Ingresos", 14, currentY)
      autoTable(doc, {
        startY: currentY + 5,
        head: [["Nombre", "Monto", "Tipo", "Fecha", "Estado"]],
        body: yearIncomes.map(p => [
          p.name,
          formatCurrency(p.amount, currency, rates),
          p.type,
          p.date,
          p.status,
        ]),
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] }, // emerald
      })
      currentY = (doc as any).lastAutoTable.finalY + 15
    }

    if (yearPayments.length > 0) {
      doc.setFontSize(14)
      doc.text("Gastos", 14, currentY)
      autoTable(doc, {
        startY: currentY + 5,
        head: [["Nombre", "Monto", "Tipo", "Vencimiento", "Estado"]],
        body: yearPayments.map(p => [
          p.name,
          formatCurrency(p.amount, currency, rates),
          p.type,
          p.due_date,
          p.status,
        ]),
        theme: "grid",
        headStyles: { fillColor: [239, 68, 68] }, // red
      })
    }
    
    if(yearPayments.length === 0 && yearIncomes.length === 0) {
        doc.setFontSize(12)
        doc.text("No hay movimientos registrados en este año.", 14, currentY)
    }

    doc.save(`reporte_anual_${selectedYear}.pdf`)
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reporte Anual</h2>
          <p className="text-muted-foreground">Analiza el desempeño de tus finanzas en el {selectedYear}.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
            <Select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-[120px] bg-background"
            >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
            </Select>

          <Button variant="outline" onClick={exportToExcel} className="gap-2 shrink-0">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={exportToPDF} className="gap-2 shrink-0">
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="premium-card relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingreso Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalIncomes, currency, { [currency]: 1 })}</div>
          </CardContent>
        </Card>
        
        <Card className="premium-card relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gasto Total</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(totalPayments, currency, { [currency]: 1 })}</div>
          </CardContent>
        </Card>

        <Card className="premium-card relative overflow-hidden lg:shadow-xl sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Utilidad del Año</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit > 0 ? "text-emerald-500" : netProfit < 0 ? "text-red-500" : ""}`}>
                {netProfit > 0 ? "+" : ""}
                {formatCurrency(netProfit, currency, { [currency]: 1 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Combo Chart: Ingresos vs Gastos */}
        <Card className="premium-card lg:col-span-2">
            <CardHeader>
            <CardTitle>Flujo de Caja Anual</CardTitle>
            <CardDescription>Comparativa mes a mes de tus ingresos versus tus gatos.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis 
                          stroke="#a1a1aa" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(v) => new Intl.NumberFormat('es-PE', { notation: "compact", compactDisplay: "short" }).format(v)} 
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: "#0f0f0f", borderColor: "#27272a", borderRadius: '8px' }} 
                            cursor={{fill: '#27272a', opacity: 0.4}}
                            formatter={(value: any) => formatCurrency(value, currency, { [currency]: 1 })} 
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                        <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        {/* Distribución de Gastos */}
        <Card className="premium-card">
            <CardHeader>
                <CardTitle>Gastos por Categoría</CardTitle>
                <CardDescription>Composición de egresos del {selectedYear}.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                {categoryData.length > 0 ? (
                    <div className="h-[300px] w-full flex flex-col items-center">
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: any) => formatCurrency(value, currency, { [currency]: 1 })}
                                    contentStyle={{ backgroundColor: "#0f0f0f", borderColor: "#27272a", borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full mt-4 space-y-2 h-[20%] overflow-y-auto pr-2 custom-scrollbar">
                            {categoryData.map((cat, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                                        <span className="text-muted-foreground truncate max-w-[120px]">{cat.name}</span>
                                    </div>
                                    <span className="font-medium ml-2">{formatCurrency(cat.value, currency, { [currency]: 1 })}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Sin gastos este año
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
