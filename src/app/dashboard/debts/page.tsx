"use client"

import * as React from "react"
import { useDebts } from "@/hooks/useDebts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2, Loader2, DollarSign, Banknote, Paperclip, Calendar as CalendarIcon, ExternalLink } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { formatCurrency, inputToBase, CURRENCY_SYMBOLS } from "@/lib/currency"
import { DatePicker } from "@/components/ui/date-picker"
import { format, parseISO } from "date-fns"

const statusBadge: Record<string, { label: string; variant: "warning" | "default" | "success" | "destructive" }> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  en_progreso: { label: "En progreso", variant: "default" },
  cancelado: { label: "Cancelado", variant: "success" },
}

export default function DebtsPage() {
  const { debts, loading, addDebt, updateDebt, deleteDebt, addDebtPayment, updateDebtPayment, deleteDebtPayment } = useDebts()
  const { currency, rates } = useCurrency()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedDebtId, setSelectedDebtId] = React.useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = React.useState("")
  const [paymentDate, setPaymentDate] = React.useState<Date | undefined>(new Date())
  const [paymentFile, setPaymentFile] = React.useState<File | null>(null)
  const [editingPaymentId, setEditingPaymentId] = React.useState<string | null>(null)

  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    debtor_name: "",
    concept: "",
    total_amount: "",
    start_date: "",
  })

  const openModal = (debt: any = null) => {
    if (debt) {
      setEditingId(debt.id)
      
      const displayAmount = currency === "PEN" 
        ? debt.total_amount 
        : debt.total_amount * (rates[currency] || 1)

      setFormData({
        debtor_name: debt.debtor_name,
        concept: debt.concept,
        total_amount: displayAmount.toFixed(2),
        start_date: debt.start_date,
      })
    } else {
      setEditingId(null)
      setFormData({ debtor_name: "", concept: "", total_amount: "", start_date: "" })
    }
    setIsModalOpen(true)
  }

  const openPaymentModal = (debtId: string, payment: any = null) => {
    setSelectedDebtId(debtId)
    if (payment) {
      setEditingPaymentId(payment.id)
      const displayAmount = currency === "PEN" 
        ? payment.amount 
        : payment.amount * (rates[currency] || 1)
      setPaymentAmount(displayAmount.toFixed(2))
      setPaymentDate(parseISO(payment.payment_date))
    } else {
      setEditingPaymentId(null)
      setPaymentAmount("")
      setPaymentDate(new Date())
    }
    setPaymentFile(null)
    setIsPaymentModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const baseAmount = inputToBase(Number(formData.total_amount), currency, rates)

    const payload = {
      debtor_name: formData.debtor_name,
      concept: formData.concept,
      total_amount: baseAmount,
      start_date: formData.start_date,
    }

    if (editingId) {
      await updateDebt(editingId, payload)
    } else {
      await addDebt(payload)
    }

    setIsSubmitting(false)
    setIsModalOpen(false)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDebtId && !editingPaymentId) return
    setIsSubmitting(true)

    const baseAmount = inputToBase(Number(paymentAmount), currency, rates)
    const formattedDate = paymentDate ? paymentDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]

    if (editingPaymentId) {
      await updateDebtPayment(editingPaymentId, { 
        amount: baseAmount, 
        payment_date: formattedDate 
      })
    } else {
      await addDebtPayment(selectedDebtId!, baseAmount, formattedDate, paymentFile || undefined)
    }

    setIsSubmitting(false)
    setIsPaymentModalOpen(false)
  }

  const handleDeletePayment = async (paymentId: string) => {
    if (confirm("¿Eliminar este abono? El saldo de la deuda se actualizará.")) {
      await deleteDebtPayment(paymentId)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar esta deuda y todos sus abonos?")) {
      await deleteDebt(id)
    }
  }

  const totalDebt = debts.reduce((sum, d) => sum + d.total_amount, 0)
  const totalRemaining = debts.reduce((sum, d) => sum + d.remaining_amount, 0)
  const totalCollected = totalDebt - totalRemaining

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deudas por Cobrar</h2>
          <p className="text-muted-foreground">Controla el dinero que te deben.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nueva Deuda
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="premium-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Prestado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDebt, currency, rates)}</div>
          </CardContent>
        </Card>
        <Card className="premium-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cobrado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalCollected, currency, rates)}</div>
          </CardContent>
        </Card>
        <Card className="premium-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{formatCurrency(totalRemaining, currency, rates)}</div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : debts.length === 0 ? (
        <div className="flex flex-col h-[30vh] items-center justify-center border-2 border-dashed border-border rounded-xl">
          <Banknote className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">Sin deudas registradas</h3>
          <p className="text-muted-foreground mb-4">Registra una deuda por cobrar.</p>
          <Button onClick={() => openModal()} variant="outline">Agregar deuda</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {debts.map(debt => {
            const progress = debt.total_amount > 0
              ? ((debt.total_amount - debt.remaining_amount) / debt.total_amount) * 100
              : 0
            const badge = statusBadge[debt.status] || statusBadge.pendiente

            return (
              <Card key={debt.id} className="premium-card">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{debt.debtor_name}</CardTitle>
                      <CardDescription>{debt.concept}</CardDescription>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cobrado: {formatCurrency(debt.total_amount - debt.remaining_amount, currency, rates)}</span>
                    <span className="font-medium">Total: {formatCurrency(debt.total_amount, currency, rates)}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Restante: <span className="text-amber-500 font-semibold">{formatCurrency(debt.remaining_amount, currency, rates)}</span>
                      </span>
                      <div className="flex gap-1">
                        {debt.remaining_amount > 0 && (
                          <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => openPaymentModal(debt.id)}>
                            <DollarSign className="h-3 w-3" /> Abonar
                          </Button>
                        )}
                        <button onClick={() => openModal(debt)} className="p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(debt.id)} className="p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Mostrar últimos abonos si existen */}
                    {(debt as any).debt_payments && (debt as any).debt_payments.length > 0 && (
                      <div className="pt-2 border-t border-border/50 mt-2">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-wider">Historial de Abonos</p>
                        <div className="space-y-1.5">
                          {(debt as any).debt_payments.slice(-3).reverse().map((pay: any) => (
                            <div key={pay.id} className="flex justify-between items-center text-[11px] bg-accent/20 p-1.5 rounded-md">
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <CalendarIcon className="h-2.5 w-2.5" /> {pay.payment_date}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-primary">{formatCurrency(pay.amount, currency, rates)}</span>
                                <div className="flex items-center gap-1">
                                  {pay.proof_url && (
                                    <a href={pay.proof_url} target="_blank" rel="noopener noreferrer" className="p-1 text-indigo-400 hover:text-indigo-300 transition-colors" title="Ver comprobante">
                                      <Paperclip className="h-3 w-3" />
                                    </a>
                                  )}
                                  <button onClick={() => openPaymentModal(debt.id, pay)} className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Editar abono">
                                    <Pencil className="h-2.5 w-2.5" />
                                  </button>
                                  <button onClick={() => handleDeletePayment(pay.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors" title="Eliminar abono">
                                    <Trash2 className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create/Edit Debt Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Deuda" : "Nueva Deuda"} description="Ingresa la información de la deuda por cobrar.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre del deudor</label>
            <Input placeholder="Ej. Carlos López" required value={formData.debtor_name} onChange={e => setFormData({ ...formData, debtor_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Concepto</label>
            <Input placeholder="Ej. Préstamo personal" required value={formData.concept} onChange={e => setFormData({ ...formData, concept: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Monto total ({CURRENCY_SYMBOLS[currency]})</label>
              <Input type="number" step="0.01" placeholder="0.00" required value={formData.total_amount} onChange={e => setFormData({ ...formData, total_amount: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de inicio</label>
              <DatePicker 
                date={formData.start_date ? parseISO(formData.start_date) : undefined}
                onChange={(date) => setFormData({ ...formData, start_date: date ? date.toISOString().split('T')[0] : "" })}
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Guardar cambios" : "Crear deuda"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Payment (Amortization) Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Registrar Abono" description="Registra un pago parcial o total de esta deuda.">
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Monto del abono ({CURRENCY_SYMBOLS[currency]})</label>
              <Input type="number" step="0.01" placeholder="0.00" required value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha del abono</label>
              <DatePicker date={paymentDate} onChange={setPaymentDate} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Comprobante (Imagen o PDF)</label>
            <div className="flex items-center gap-2">
              <Input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={e => setPaymentFile(e.target.files?.[0] || null)}
                className="cursor-pointer file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-2 file:py-1 file:text-xs file:mr-2"
              />
              {paymentFile && <Paperclip className="h-4 w-4 text-emerald-500" />}
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingPaymentId ? "Guardar cambios" : "Registrar abono"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
