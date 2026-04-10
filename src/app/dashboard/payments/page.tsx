"use client"

import * as React from "react"
import { usePayments } from "@/hooks/usePayments"
import { useAccounts } from "@/hooks/useAccounts"
import { useCategories } from "@/hooks/useCategories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2, Loader2, CheckCircle2, Filter, Zap } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { formatCurrency, inputToBase, CURRENCY_SYMBOLS } from "@/lib/currency"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/ui/date-picker"
import { parseISO } from "date-fns"

const statusMap: Record<string, { label: string; variant: "default" | "success" | "destructive" | "warning" }> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  pagado: { label: "Pagado", variant: "success" },
  vencido: { label: "Vencido", variant: "destructive" },
}

export default function PaymentsPage() {
  const { payments, loading, addPayment, updatePayment, deletePayment, markAsPaid } = usePayments()
  const { accounts } = useAccounts()
  const { categories } = useCategories()
  const { currency, rates } = useCurrency()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [filterStatus, setFilterStatus] = React.useState("all")
  const [filterType, setFilterType] = React.useState("all")
  const [filterCategory, setFilterCategory] = React.useState("all")

  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    name: "",
    amount: "",
    type: "unico",
    frequency: "mensual",
    due_date: "",
    payment_method: "Tarjeta de Débito",
    isAutomatic: false,
    validity: "12",
    account_id: "",
    category_id: "",
    status: "pendiente",
  })

  const openModal = (payment: any = null) => {
    if (payment) {
      setEditingId(payment.id)
      
      const displayAmount = currency === "PEN" 
        ? payment.amount 
        : payment.amount * (rates[currency] || 1)

      let parsedMethod = "Tarjeta de Débito"
      let isAuto = false
      try {
        const parsed = JSON.parse(payment.payment_method || "{}")
        if (parsed.method) parsedMethod = parsed.method
        if (typeof parsed.auto === "boolean") isAuto = parsed.auto
      } catch {
        if (payment.payment_method === "automatico") isAuto = true
      }

      setFormData({
        name: payment.name,
        amount: displayAmount.toFixed(2),
        type: payment.type,
        frequency: payment.frequency || "mensual",
        due_date: payment.due_date,
        payment_method: parsedMethod,
        isAutomatic: isAuto,
        validity: "12",
        account_id: payment.account_id || "",
        category_id: payment.category_id || "",
        status: payment.status,
      })
    } else {
      setEditingId(null)
      setFormData({
        name: "", amount: "", type: "unico", frequency: "mensual",
        due_date: "", payment_method: "Tarjeta de Débito", isAutomatic: false, validity: "12", account_id: "", category_id: "", status: "pendiente",
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const baseAmount = inputToBase(Number(formData.amount), currency, rates)

    const paymentMethodPayload = JSON.stringify({
      method: formData.payment_method,
      auto: formData.isAutomatic
    })

    const payload = {
      name: formData.name,
      amount: baseAmount,
      type: formData.type,
      frequency: formData.type === "recurrente" ? formData.frequency : null,
      due_date: formData.due_date,
      payment_method: paymentMethodPayload,
      account_id: formData.account_id || null,
      category_id: formData.category_id || null,
      status: formData.status,
    }

    if (editingId) {
      await updatePayment(editingId, payload)
    } else {
      // Pasamos también la vigencia si es recurrente
      await addPayment(payload, formData.type === "recurrente" ? Number(formData.validity) : 1)
    }

    setIsSubmitting(false)
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este pago?")) {
      await deletePayment(id)
    }
  }

  const filteredPayments = payments.filter(p => {
    const matchStatus = filterStatus === "all" || p.status === filterStatus
    const matchType = filterType === "all" || p.type === filterType
    const matchCategory = filterCategory === "all" || p.category_id === filterCategory
    return matchStatus && matchType && matchCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pagos & Gastos</h2>
          <p className="text-muted-foreground">Registra, filtra y gestiona todos tus pagos.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nuevo Pago
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select className="w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
          <option value="vencido">Vencido</option>
        </Select>
        <Select className="w-40" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">Todos los tipos</option>
          <option value="recurrente">Recurrente</option>
          <option value="unico">Único</option>
        </Select>
        <Select className="w-40" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">Todas las categorías</option>
          <option value="">Sin categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="flex flex-col h-[40vh] items-center justify-center border-2 border-dashed border-border rounded-xl">
          <h3 className="text-lg font-medium">Sin pagos registrados</h3>
          <p className="text-muted-foreground mb-4">Crea tu primer pago para empezar a llevar el control.</p>
          <Button onClick={() => openModal()} variant="outline">Agregar pago</Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                <th className="pb-3 pr-4 font-medium">Nombre</th>
                <th className="pb-3 pr-4 font-medium">Monto</th>
                <th className="pb-3 pr-4 font-medium hidden md:table-cell">Tipo</th>
                <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Frecuencia</th>
                <th className="pb-3 pr-4 font-medium">Vence</th>
                <th className="pb-3 pr-4 font-medium">Estado</th>
                <th className="pb-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => {
                const badge = statusMap[payment.status] || statusMap.pendiente
                
                let isAuto = false;
                try {
                  const p = JSON.parse(payment.payment_method || "{}");
                  isAuto = p.auto;
                } catch {
                  if (payment.payment_method === "automatico") isAuto = true;
                }

                return (
                  <tr key={payment.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 pr-4 font-medium">
                      <div className="flex items-center gap-2">
                        {payment.name}
                        {isAuto && <div title="Automático"><Zap className="h-3 w-3 text-amber-500" /></div>}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-primary font-semibold">{formatCurrency(payment.amount, currency, rates)}</td>
                    <td className="py-3 pr-4 capitalize hidden md:table-cell text-muted-foreground text-sm">
                      {payment.type}
                    </td>
                    <td className="py-3 pr-4 capitalize hidden lg:table-cell text-muted-foreground text-sm">
                      {payment.frequency || "—"}
                    </td>
                    <td className="py-3 pr-4 text-sm">{payment.due_date}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {payment.status !== "pagado" && (
                          <button
                            onClick={() => markAsPaid(payment)}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors"
                            title="Marcar como pagado"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => openModal(payment)} className="p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(payment.id)} className="p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Editar Pago" : "Nuevo Pago"}
        description="Completa la información del pago o gasto."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input placeholder="Ej. Netflix, Alquiler..." required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Monto ({CURRENCY_SYMBOLS[currency]})</label>
              <Input type="number" step="0.01" placeholder="0.00" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="unico">Único</option>
                <option value="recurrente">Recurrente</option>
              </Select>
            </div>
            {formData.type === "recurrente" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frecuencia</label>
                  <Select value={formData.frequency} onChange={e => setFormData({ ...formData, frequency: e.target.value })}>
                    <option value="semanal">Semanal</option>
                    <option value="quincenal">Quincenal</option>
                    <option value="mensual">Mensual</option>
                    <option value="bimestral">Bimestral</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                  </Select>
                </div>
                {!editingId && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vigencia (Cantidad)</label>
                    <Input type="number" min="1" max="120" placeholder="Ej. 12" required value={formData.validity} onChange={e => setFormData({ ...formData, validity: e.target.value })} />
                  </div>
                )}
              </>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de vencimiento {!editingId && formData.type === "recurrente" && "(Inicial)"}</label>
              <DatePicker 
                date={formData.due_date ? parseISO(formData.due_date) : undefined}
                onChange={(date) => setFormData({ ...formData, due_date: date ? date.toISOString().split('T')[0] : "" })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Medio de Pago</label>
              <Select value={formData.payment_method} onChange={e => setFormData({ ...formData, payment_method: e.target.value })}>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="Transferencia">Transferencia Bancaria</option>
                <option value="App Móvil (Yape/Plin)">App Móvil (Yape/Plin)</option>
              </Select>
            </div>
            
            <div className="space-y-2 flex flex-col justify-center">
              <label className="text-sm font-medium mb-1 flex items-center gap-2">Débito Automático <Zap className="h-3 w-3 text-amber-500" /></label>
              <div className="flex items-center gap-2 mt-1">
                <Switch 
                  checked={formData.isAutomatic}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isAutomatic: checked })}
                />
                <span className="text-sm text-muted-foreground">{formData.isAutomatic ? 'Sí, pagar solo el día de corte' : 'No, pagarlo manualmente'}</span>
              </div>
            </div>
            {accounts.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Cuenta asociada</label>
                <Select value={formData.account_id} onChange={e => setFormData({ ...formData, account_id: e.target.value })}>
                  <option value="">Sin asociar</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                <option value="">Sin categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="vencido">Vencido</option>
              </Select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Guardar cambios" : "Crear pago"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
