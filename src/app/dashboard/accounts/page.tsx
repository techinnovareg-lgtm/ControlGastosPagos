"use client"

import * as React from "react"
import { useAccounts } from "@/hooks/useAccounts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Select } from "@/components/ui/select"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { PlusCircle, CreditCard, Landmark, Pencil, Trash2, Loader2 } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { formatCurrency, inputToBase, CURRENCY_SYMBOLS } from "@/lib/currency"

export default function AccountsPage() {
  const { accounts, loading, addAccount, updateAccount, deleteAccount } = useAccounts()
  const { currency, rates } = useCurrency()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  // State for form
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    name: "",
    type: "Cuenta", // 'Cuenta' | 'Tarjeta'
    initial_balance: "",
  })

  const openModal = (accountToEdit: any = null) => {
    if (accountToEdit) {
      setEditingId(accountToEdit.id)
      
      const displayAmount = currency === "PEN" 
        ? accountToEdit.initial_balance 
        : accountToEdit.initial_balance * (rates[currency] || 1)

      setFormData({
        name: accountToEdit.name,
        type: accountToEdit.type,
        initial_balance: displayAmount.toFixed(2),
      })
    } else {
      setEditingId(null)
      setFormData({ name: "", type: "Cuenta", initial_balance: "" })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const baseAmount = inputToBase(Number(formData.initial_balance), currency, rates)
    
    const payload = {
      name: formData.name,
      type: formData.type,
      initial_balance: baseAmount,
      current_balance: baseAmount // Simplified, usually initial != current after ops
    }

    if (editingId) {
      await updateAccount(editingId, payload)
    } else {
      await addAccount(payload)
    }
    
    setIsSubmitting(false)
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar esta cuenta? Se pueden perder datos asociados.")) {
      await deleteAccount(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cuentas y Tarjetas</h2>
          <p className="text-muted-foreground">Gestiona tus fuentes de dinero.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nueva Cuenta
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col h-[40vh] items-center justify-center border-2 border-dashed border-border rounded-xl">
          <Landmark className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No hay cuentas registradas</h3>
          <p className="text-muted-foreground mb-4">Empieza agregando tu primera cuenta o tarjeta.</p>
          <Button onClick={() => openModal()} variant="outline">Crear cuenta</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map(account => (
            <Card key={account.id} className="premium-card">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {account.type === 'Tarjeta' ? <CreditCard className="h-4 w-4" /> : <Landmark className="h-4 w-4" />}
                    {account.name}
                  </CardTitle>
                  <CardDescription>{account.type}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(account)} className="p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(account.id)} className="p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mt-2 text-primary">
                  {formatCurrency(account.current_balance || 0, currency, rates)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Saldo Actual</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Editar Cuenta" : "Nueva Cuenta"}
        description="Ingresa los detalles de tu cuenta bancaria o tarjeta de crédito."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de la cuenta</label>
            <Input 
              placeholder="Ej. BCP Sueldo, Tarjeta Ripley..." 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="Cuenta">Cuenta Bancaria</option>
              <option value="Tarjeta">Tarjeta de Crédito</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Saldo Inicial ({CURRENCY_SYMBOLS[currency]})</label>
            <Input 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              required
              value={formData.initial_balance}
              onChange={e => setFormData({...formData, initial_balance: e.target.value})}
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Guardar cambios" : "Crear cuenta"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
