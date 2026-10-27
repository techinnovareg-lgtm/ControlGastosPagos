"use client"

import * as React from "react"
import { useDebts, Debt, DebtPayment } from "@/hooks/useDebts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Loader2, 
  DollarSign, 
  Banknote, 
  Paperclip, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
  ArrowUpRight
} from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { formatCurrency, inputToBase, CURRENCY_SYMBOLS } from "@/lib/currency"
import { DatePicker } from "@/components/ui/date-picker"
import { parseISO } from "date-fns"

const statusBadge: Record<string, { label: string; variant: "warning" | "default" | "success" | "destructive"; icon: any }> = {
  pendiente: { label: "Pendiente", variant: "warning", icon: Clock },
  en_progreso: { label: "En progreso", variant: "default", icon: ArrowUpRight },
  cancelado: { label: "Cobrado / Liquidado", variant: "success", icon: CheckCircle2 },
}

export default function DebtsPage() {
  const { debts, loading, addDebt, updateDebt, deleteDebt, addDebtPayment, updateDebtPayment, deleteDebtPayment } = useDebts()
  const { currency, rates } = useCurrency()
  
  // Modales
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [paymentFormError, setPaymentFormError] = React.useState<string | null>(null)

  // Expandir historial de abonos por deuda
  const [expandedHistories, setExpandedHistories] = React.useState<Record<string, boolean>>({})

  // Estado para Crear / Editar Deuda
  const [editingDebt, setEditingDebt] = React.useState<Debt | null>(null)
  const [formData, setFormData] = React.useState({
    debtor_name: "",
    concept: "",
    total_amount: "",
    start_date: "",
    status: "pendiente" as "pendiente" | "en_progreso" | "cancelado",
  })

  // Estado para Registrar / Editar Abono
  const [targetDebt, setTargetDebt] = React.useState<Debt | null>(null)
  const [editingPayment, setEditingPayment] = React.useState<DebtPayment | null>(null)
  const [paymentAmount, setPaymentAmount] = React.useState("")
  const [paymentDate, setPaymentDate] = React.useState<Date | undefined>(new Date())
  const [paymentFile, setPaymentFile] = React.useState<File | null>(null)

  const toggleHistory = (debtId: string) => {
    setExpandedHistories(prev => ({ ...prev, [debtId]: !prev[debtId] }))
  }

  // Abrir Modal de Deuda (Crear o Editar)
  const openModal = (debt: Debt | null = null) => {
    setFormError(null)
    if (debt) {
      setEditingDebt(debt)
      const displayAmount = currency === "PEN" 
        ? debt.total_amount 
        : debt.total_amount * (rates[currency] || 1)

      setFormData({
        debtor_name: debt.debtor_name,
        concept: debt.concept,
        total_amount: displayAmount.toFixed(2),
        start_date: debt.start_date || "",
        status: debt.status || "pendiente",
      })
    } else {
      setEditingDebt(null)
      setFormData({ 
        debtor_name: "", 
        concept: "", 
        total_amount: "", 
        start_date: new Date().toISOString().split("T")[0],
        status: "pendiente"
      })
    }
    setIsModalOpen(true)
  }

  // Abrir Modal de Abono
  const openPaymentModal = (debt: Debt, payment: DebtPayment | null = null) => {
    setTargetDebt(debt)
    setPaymentFormError(null)
    setPaymentFile(null)

    if (payment) {
      setEditingPayment(payment)
      const displayAmount = currency === "PEN" 
        ? payment.amount 
        : payment.amount * (rates[currency] || 1)
      setPaymentAmount(displayAmount.toFixed(2))
      setPaymentDate(payment.payment_date ? parseISO(payment.payment_date) : new Date())
    } else {
      setEditingPayment(null)
      setPaymentAmount("")
      setPaymentDate(new Date())
    }
    setIsPaymentModalOpen(true)
  }

  // Submit Deuda
  const handleSubmitDebt = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    try {
      const numAmount = parseFloat(formData.total_amount)
      if (isNaN(numAmount) || numAmount <= 0) {
        setFormError("Por favor ingresa un monto válido mayor a 0.")
        setIsSubmitting(false)
        return
      }

      const baseAmount = inputToBase(numAmount, currency, rates)

      const payload = {
        debtor_name: formData.debtor_name.trim(),
        concept: formData.concept.trim(),
        total_amount: baseAmount,
        start_date: formData.start_date || new Date().toISOString().split("T")[0],
        status: formData.status,
      }

      if (editingDebt) {
        const { error } = await updateDebt(editingDebt.id, payload)
        if (error) {
          setFormError(`Error al actualizar deuda: ${error.message}`)
          setIsSubmitting(false)
          return
        }
      } else {
        const { error } = await addDebt(payload)
        if (error) {
          setFormError(`Error al crear deuda: ${error.message}`)
          setIsSubmitting(false)
          return
        }
      }

      setIsModalOpen(false)
    } catch (err: any) {
      setFormError(err?.message || "Ocurrió un error inesperado al guardar la deuda.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit Abono
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetDebt) return
    setPaymentFormError(null)
    setIsSubmitting(true)

    try {
      const numAmount = parseFloat(paymentAmount)
      if (isNaN(numAmount) || numAmount <= 0) {
        setPaymentFormError("Por favor ingresa un monto de abono válido mayor a 0.")
        setIsSubmitting(false)
        return
      }

      const baseAmount = inputToBase(numAmount, currency, rates)
      const formattedDate = paymentDate 
        ? paymentDate.toISOString().split("T")[0] 
        : new Date().toISOString().split("T")[0]

      if (editingPayment) {
        const { error } = await updateDebtPayment(targetDebt.id, editingPayment.id, {
          amount: baseAmount,
          payment_date: formattedDate,
        })
        if (error) {
          setPaymentFormError(`Error al actualizar el abono: ${error.message}`)
          setIsSubmitting(false)
          return
        }
      } else {
        const { error } = await addDebtPayment(targetDebt.id, baseAmount, formattedDate, paymentFile || undefined)
        if (error) {
          setPaymentFormError(`Error al registrar el abono: ${error.message}`)
          setIsSubmitting(false)
          return
        }
      }

      setIsPaymentModalOpen(false)
    } catch (err: any) {
      setPaymentFormError(err?.message || "Ocurrió un error al registrar el abono.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminar Abono
  const handleDeletePayment = async (debtId: string, paymentId: string) => {
    if (confirm("¿Estás seguro de eliminar este abono? El saldo pendiente de la deuda se recalculará automáticamente.")) {
      await deleteDebtPayment(debtId, paymentId)
    }
  }

  // Eliminar Deuda
  const handleDeleteDebt = async (id: string, debtorName: string) => {
    if (confirm(`¿Estás seguro de eliminar la deuda de "${debtorName}" y todo su historial de abonos? Esta acción no se puede deshacer.`)) {
      await deleteDebt(id)
    }
  }

  // Cálculos globales
  const totalDebt = debts.reduce((sum, d) => sum + Number(d.total_amount || 0), 0)
  const totalRemaining = debts.reduce((sum, d) => sum + Number(d.remaining_amount || 0), 0)
  const totalCollected = Math.max(0, totalDebt - totalRemaining)
  const collectionPercentage = totalDebt > 0 ? Math.round((totalCollected / totalDebt) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Deudas por Cobrar</h2>
          <p className="text-sm text-slate-500">Controla el dinero que te adeudan, registra abonos y gestiona cobranzas.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold">
          <PlusCircle className="h-4 w-4" />
          Nueva Deuda
        </Button>
      </div>

      {/* Tarjetas de Resumen Financiero */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-white border border-slate-200/80 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Prestado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalDebt, currency, rates)}</div>
            <p className="text-xs text-slate-400 mt-1">{debts.length} {debts.length === 1 ? "registro activo" : "registros activos"}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200/80 shadow-sm rounded-xl">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cobrado (Abonado)</CardTitle>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {collectionPercentage}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalCollected, currency, rates)}</div>
            <p className="text-xs text-slate-400 mt-1">Total recuperado a la fecha</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200/80 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Saldo Pendiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalRemaining, currency, rates)}</div>
            <p className="text-xs text-slate-400 mt-1">Dinero por recuperar</p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      {loading ? (
        <div className="flex h-[35vh] items-center justify-center bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : debts.length === 0 ? (
        <div className="flex flex-col h-[35vh] items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-white p-6 text-center shadow-sm">
          <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
            <Banknote className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No tienes deudas registradas</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-4">
            Registra préstamos que hayas hecho a personas o clientes para llevar el control exacto de sus abonos.
          </p>
          <Button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
            <PlusCircle className="mr-2 h-4 w-4" /> Registrar mi primera deuda
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {debts.map(debt => {
            const total = Number(debt.total_amount || 0)
            const remaining = Number(debt.remaining_amount || 0)
            const collected = Math.max(0, total - remaining)
            const progress = total > 0 ? (collected / total) * 100 : 0
            const badge = statusBadge[debt.status] || statusBadge.pendiente
            const BadgeIcon = badge.icon
            const payments = (debt as any).debt_payments || []
            const isExpanded = !!expandedHistories[debt.id]
            const isCompleted = remaining <= 0

            return (
              <Card key={debt.id} className="bg-white border border-slate-200/80 shadow-sm rounded-xl hover:shadow-md transition-shadow flex flex-col justify-between">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm shrink-0 mt-0.5">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-slate-900 leading-tight">{debt.debtor_name}</CardTitle>
                        <CardDescription className="text-xs text-slate-500 mt-0.5">{debt.concept}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant={badge.variant} className="gap-1 text-[11px] font-semibold py-0.5 px-2">
                        <BadgeIcon className="h-3 w-3" />
                        {badge.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 flex-1">
                  {/* Resumen de montos */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50/80 rounded-lg border border-slate-100 text-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Total</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">{formatCurrency(total, currency, rates)}</p>
                    </div>
                    <div className="border-x border-slate-200/70">
                      <p className="text-[10px] uppercase font-bold text-emerald-600">Cobrado</p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-600">{formatCurrency(collected, currency, rates)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-amber-600">Restante</p>
                      <p className="text-xs sm:text-sm font-bold text-amber-600">{formatCurrency(remaining, currency, rates)}</p>
                    </div>
                  </div>

                  {/* Barra de Progreso */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Progreso de cobro</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-500'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Fecha de inicio */}
                  <div className="flex items-center text-xs text-slate-400 gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                    <span>Fecha de préstamo: <span className="font-medium text-slate-600">{debt.start_date || "No especificada"}</span></span>
                  </div>

                  {/* Acciones principales de la tarjeta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      {/* Botón EDITAR DEUDA (Explícito y claro) */}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openModal(debt)}
                        className="h-8 text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-100 text-slate-700"
                        title="Editar datos de esta deuda"
                      >
                        <Pencil className="h-3.5 w-3.5 text-indigo-600" />
                        Editar Deuda
                      </Button>

                      {/* Botón Eliminar Deuda */}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteDebt(debt.id, debt.debtor_name)}
                        className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2"
                        title="Eliminar deuda y sus pagos"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Botón REGISTRAR ABONO */}
                    {!isCompleted ? (
                      <Button 
                        size="sm" 
                        onClick={() => openPaymentModal(debt)}
                        className="h-8 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Registrar Abono
                      </Button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Liquidada
                      </span>
                    )}
                  </div>

                  {/* Sección de Historial de Abonos */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Historial de Abonos ({payments.length})
                      </span>
                      {payments.length > 3 && (
                        <button
                          type="button"
                          onClick={() => toggleHistory(debt.id)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5"
                        >
                          {isExpanded ? (
                            <>Mostrar menos <ChevronUp className="h-3 w-3" /></>
                          ) : (
                            <>Ver todos ({payments.length}) <ChevronDown className="h-3 w-3" /></>
                          )}
                        </button>
                      )}
                    </div>

                    {payments.length === 0 ? (
                      <div className="text-center py-3 bg-slate-50/60 rounded-lg border border-dashed border-slate-200">
                        <p className="text-xs text-slate-400">Sin abonos registrados aún.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Haz clic en &quot;Registrar Abono&quot; para añadir un pago parcial o total.</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {(isExpanded ? [...payments].reverse() : [...payments].slice(-3).reverse()).map((pay: DebtPayment) => (
                          <div 
                            key={pay.id} 
                            className="flex justify-between items-center text-xs bg-slate-50/90 hover:bg-slate-100/80 p-2 rounded-lg border border-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                              <span className="text-slate-600 font-medium">{pay.payment_date}</span>
                              {pay.proof_url && (
                                <a 
                                  href={pay.proof_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-indigo-600 hover:text-indigo-800 p-0.5"
                                  title="Ver comprobante adjunto"
                                >
                                  <Paperclip className="h-3 w-3" />
                                </a>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-bold text-emerald-600">
                                +{formatCurrency(pay.amount, currency, rates)}
                              </span>
                              <div className="flex items-center gap-0.5 border-l border-slate-200 pl-1.5 ml-1">
                                <button
                                  onClick={() => openPaymentModal(debt, pay)}
                                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
                                  title="Editar abono"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeletePayment(debt.id, pay.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Eliminar abono"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal: CREAR O EDITAR DEUDA */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingDebt ? "Editar Deuda por Cobrar" : "Nueva Deuda por Cobrar"} 
        description={editingDebt ? `Modifica los datos de la deuda de ${formData.debtor_name || "este cliente"}.` : "Registra un préstamo o cuenta por cobrar."}
      >
        <form onSubmit={handleSubmitDebt} className="space-y-4">
          {formError && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Nombre del Deudor / Persona</label>
            <Input 
              placeholder="Ej. Juan Pérez" 
              required 
              value={formData.debtor_name} 
              onChange={e => setFormData({ ...formData, debtor_name: e.target.value })}
              className="bg-white border-slate-200" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Concepto / Motivo</label>
            <Input 
              placeholder="Ej. Préstamo personal para estudios" 
              required 
              value={formData.concept} 
              onChange={e => setFormData({ ...formData, concept: e.target.value })}
              className="bg-white border-slate-200" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Monto Total Original ({CURRENCY_SYMBOLS[currency]})
              </label>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                required 
                value={formData.total_amount} 
                onChange={e => setFormData({ ...formData, total_amount: e.target.value })}
                className="bg-white border-slate-200" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Fecha de Inicio / Préstamo</label>
              <DatePicker 
                date={formData.start_date ? parseISO(formData.start_date) : undefined}
                onChange={(date) => setFormData({ ...formData, start_date: date ? date.toISOString().split('T')[0] : "" })}
              />
            </div>
          </div>

          {editingDebt && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Estado de la Deuda</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="pendiente">Pendiente (Sin abonos)</option>
                <option value="en_progreso">En progreso (Con abonos parciales)</option>
                <option value="cancelado">Cobrado / Liquidado (Deuda saldada)</option>
              </select>
            </div>
          )}

          {/* Desglose informativo si se está editando */}
          {editingDebt && (
            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Total abonado hasta hoy:</span>
                <span className="font-semibold text-emerald-700">
                  {formatCurrency(
                    ((editingDebt as any).debt_payments || []).reduce((s: number, p: any) => s + Number(p.amount), 0),
                    currency,
                    rates
                  )}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Nota: Al modificar el monto total, el saldo restante se actualizará automáticamente restando los abonos ya realizados.
              </p>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingDebt ? "Guardar Cambios" : "Crear Deuda"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: REGISTRAR O EDITAR ABONO */}
      <Modal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        title={editingPayment ? "Editar Abono" : "Registrar Abono"} 
        description={targetDebt ? `Deuda de ${targetDebt.debtor_name} — "${targetDebt.concept}"` : "Registra un pago."}
      >
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          {paymentFormError && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{paymentFormError}</span>
            </div>
          )}

          {targetDebt && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Saldo Pendiente Actual</span>
                <span className="text-sm font-bold text-amber-600">
                  {formatCurrency(targetDebt.remaining_amount, currency, rates)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Monto Total Original</span>
                <span className="text-sm font-semibold text-slate-700">
                  {formatCurrency(targetDebt.total_amount, currency, rates)}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Monto del Abono ({CURRENCY_SYMBOLS[currency]})
              </label>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                required 
                value={paymentAmount} 
                onChange={e => setPaymentAmount(e.target.value)}
                className="bg-white border-slate-200" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Fecha del Abono</label>
              <DatePicker date={paymentDate} onChange={setPaymentDate} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Comprobante de pago (Opcional - Imagen o PDF)
            </label>
            <div className="flex items-center gap-2">
              <Input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={e => setPaymentFile(e.target.files?.[0] || null)}
                className="cursor-pointer file:bg-indigo-50 file:text-indigo-700 file:border-0 file:rounded-md file:px-2.5 file:py-1 file:text-xs file:mr-2 file:font-semibold hover:file:bg-indigo-100 text-xs"
              />
              {paymentFile && <Paperclip className="h-4 w-4 text-emerald-600 shrink-0" />}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingPayment ? "Actualizar Abono" : "Guardar Abono"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
