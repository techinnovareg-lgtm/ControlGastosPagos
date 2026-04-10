"use client"

import * as React from "react"
import { useIncomes } from "@/hooks/useIncomes"
import { useAccounts } from "@/hooks/useAccounts"
import { useCategories } from "@/hooks/useCategories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Pencil, Trash2, Loader2, CheckCircle2, Filter, Wallet } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { formatCurrency, inputToBase, CURRENCY_SYMBOLS } from "@/lib/currency"
import { DatePicker } from "@/components/ui/date-picker"
import { parseISO } from "date-fns"

const statusMap: Record<string, { label: string; variant: "default" | "success" | "destructive" | "warning" }> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  recibido: { label: "Recibido", variant: "success" },
}

export default function IncomesPage() {
  const { incomes, loading, addIncome, updateIncome, deleteIncome, markAsReceived } = useIncomes()
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
    date: "",
    validity: "1",
    account_id: "",
    category_id: "",
    status: "pendiente",
  })

  const openModal = (income: any = null) => {
    if (income) {
      setEditingId(income.id)
      
      const displayAmount = currency === "PEN" 
        ? income.amount 
        : income.amount * (rates[currency] || 1)

      setFormData({
        name: income.name,
        amount: displayAmount.toFixed(2),
        type: income.type,
        frequency: income.frequency || "mensual",
        date: income.date,
        validity: "12",
        account_id: income.account_id || "",
        category_id: income.category_id || "",
        status: income.status,
      })
    } else {
      setEditingId(null)
      setFormData({
        name: "", amount: "", type: "unico", frequency: "mensual",
        date: "", validity: "1", account_id: "", category_id: "", status: "recibido",
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const baseAmount = inputToBase(Number(formData.amount), currency, rates)

    const payload = {
      name: formData.name,
      amount: baseAmount,
      type: formData.type,
      frequency: formData.type === "recurrente" ? formData.frequency : null,
      date: formData.date,
      account_id: formData.account_id || null,
      category_id: formData.category_id || null,
      status: formData.status,
    }

    if (editingId) {
      await updateIncome(editingId, payload)
    } else {
      await addIncome(payload, formData.type === "recurrente" ? Number(formData.validity) : 1)
    }

    setIsSubmitting(false)
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este ingreso? (Se descontará de tu cuenta si estaba como 'Recibido')")) {
      await deleteIncome(id)
    }
  }

  const filteredIncomes = incomes.filter(inc => {
    const matchStatus = filterStatus === "all" || inc.status === filterStatus
    const matchType = filterType === "all" || inc.type === filterType
    const matchCategory = filterCategory === "all" || inc.category_id === filterCategory
    return matchStatus && matchType && matchCategory
  })

  // Calcular totales del mes actual
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const totalReceived = incomes
    .filter(i => i.status === "recibido" && new Date(i.date).getMonth() === currentMonth && new Date(i.date).getFullYear() === currentYear)
    .reduce((sum, item) => sum + item.amount, 0)
    
  const totalPending = incomes
    .filter(i => i.status === "pendiente" && new Date(i.date).getMonth() === currentMonth && new Date(i.date).getFullYear() === currentYear)
    .reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-emerald-500 flex items-center gap-2">
            <Wallet className="h-8 w-8" /> Ingresos
          </h2>
          <p className="text-muted-foreground">Lleva el control del dinero que entra y vincúlalo a tus cuentas.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20">
          <PlusCircle className="h-4 w-4" />
          Nuevo Ingreso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col">
          <span className="text-sm font-medium text-emerald-600/80 mb-1">Recibido este Mes</span>
          <span className="text-2xl font-bold text-emerald-500">{formatCurrency(totalReceived, currency, rates)}</span>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col">
          <span className="text-sm font-medium text-amber-600/80 mb-1">Pendiente este Mes</span>
          <span className="text-2xl font-bold text-amber-500">{formatCurrency(totalPending, currency, rates)}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center pt-4 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select className="w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="recibido">Recibido</option>
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
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : filteredIncomes.length === 0 ? (
        <div className="flex flex-col h-[40vh] items-center justify-center border-2 border-dashed border-border rounded-xl">
          <h3 className="text-lg font-medium">Sin ingresos registrados</h3>
          <p className="text-muted-foreground mb-4">Anota tu sueldo o rentas iniciales.</p>
          <Button onClick={() => openModal()} variant="outline" className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10">Agregar ingreso</Button>
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
                <th className="pb-3 pr-4 font-medium">Fecha</th>
                <th className="pb-3 pr-4 font-medium">Estado</th>
                <th className="pb-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.map(inc => {
                const badge = statusMap[inc.status] || statusMap.pendiente

                return (
                  <tr key={inc.id} className="border-b border-border/50 hover:bg-emerald-900/10 transition-colors">
                    <td className="py-3 pr-4 font-medium text-emerald-100">{inc.name}</td>
                    <td className="py-3 pr-4 font-semibold text-emerald-400">{formatCurrency(inc.amount, currency, rates)}</td>
                    <td className="py-3 pr-4 capitalize hidden md:table-cell text-muted-foreground text-sm">{inc.type}</td>
                    <td className="py-3 pr-4 capitalize hidden lg:table-cell text-muted-foreground text-sm">{inc.frequency || "—"}</td>
                    <td className="py-3 pr-4 text-sm">{inc.date}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {inc.status !== "recibido" && (
                          <button
                            onClick={() => markAsReceived(inc)}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-500/20 rounded-md transition-colors"
                            title="Marcar como recibido"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => openModal(inc)} className="p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(inc.id)} className="p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors">
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
        title={editingId ? "Editar Ingreso" : "Nuevo Ingreso"}
        description="Anota el dinero que entra a tus cuentas."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Nombre (Ej. Sueldo, Alquiler)</label>
              <Input placeholder="Ej. Quincena de Marzo" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
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
              <label className="text-sm font-medium">Fecha de recepción</label>
              <DatePicker 
                date={formData.date ? parseISO(formData.date) : undefined}
                onChange={(date) => setFormData({ ...formData, date: date ? date.toISOString().split('T')[0] : "" })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="recibido">✅ Ya lo Recibí</option>
                <option value="pendiente">⏳ Pendiente</option>
              </Select>
            </div>

            {accounts.length > 0 && (
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">¿Sumar dinero a una cuenta?</label>
                <Select value={formData.account_id} onChange={e => setFormData({ ...formData, account_id: e.target.value })}>
                  <option value="">No sumar a ninguna cuenta</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Si marcas como 'Recibido', el dinero se inyectará automáticamente en esta cuenta.</p>
              </div>
            )}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                <option value="">Sin categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Guardar cambios" : "Crear ingreso"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
