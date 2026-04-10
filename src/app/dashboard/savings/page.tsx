"use client"

import * as React from "react"
import { useSavings, type SavingsGoal } from "@/hooks/useSavings"
import { useAccounts } from "@/hooks/useAccounts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PlusCircle, Target, Loader2, Coins, Pencil, Trash2, PiggyBank, ArrowUpRight } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { formatCurrency, inputToBase, CURRENCY_SYMBOLS } from "@/lib/currency"
import { DatePicker } from "@/components/ui/date-picker"
import { parseISO } from "date-fns"

export default function SavingsPage() {
  const { goals, loading, addGoal, updateGoal, deleteGoal, addContribution } = useSavings()
  const { accounts } = useAccounts()
  const { currency, rates } = useCurrency()
  
  // Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = React.useState(false)
  const [isSubmittingGoal, setIsSubmittingGoal] = React.useState(false)
  const [editingGoalId, setEditingGoalId] = React.useState<string | null>(null)
  
  const [goalFormData, setGoalFormData] = React.useState({
    name: "",
    target_amount: "",
    target_date: "",
    color: "#3b82f6",
    status: "en_progreso"
  })

  // Contribution Modal State
  const [isContribModalOpen, setIsContribModalOpen] = React.useState(false)
  const [isSubmittingContrib, setIsSubmittingContrib] = React.useState(false)
  const [activeGoalForContrib, setActiveGoalForContrib] = React.useState<SavingsGoal | null>(null)
  
  const [contribFormData, setContribFormData] = React.useState({
    amount: "",
    account_id: "",
    date: new Date().toISOString().split('T')[0]
  })

  const openGoalModal = (goal: SavingsGoal | null = null) => {
    if (goal) {
      setEditingGoalId(goal.id)
      const displayAmount = currency === "PEN" ? goal.target_amount : goal.target_amount * (rates[currency] || 1)
      setGoalFormData({
        name: goal.name,
        target_amount: displayAmount.toFixed(2),
        target_date: goal.target_date || "",
        color: goal.color || "#3b82f6",
        status: goal.status
      })
    } else {
      setEditingGoalId(null)
      setGoalFormData({
        name: "", target_amount: "", target_date: "", color: "#3b82f6", status: "en_progreso"
      })
    }
    setIsGoalModalOpen(true)
  }

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingGoal(true)

    const baseAmount = inputToBase(Number(goalFormData.target_amount), currency, rates)

    if (editingGoalId) {
      await updateGoal(editingGoalId, { 
        name: goalFormData.name, 
        target_amount: baseAmount, 
        target_date: goalFormData.target_date || null,
        color: goalFormData.color,
        status: goalFormData.status
      })
    } else {
      await addGoal({
        name: goalFormData.name,
        target_amount: baseAmount,
        target_date: goalFormData.target_date || null,
        color: goalFormData.color,
        status: goalFormData.status
      })
    }

    setIsSubmittingGoal(false)
    setIsGoalModalOpen(false)
  }

  const handleDeleteGoal = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta meta? Se perderá el historial de aportes.")) {
      await deleteGoal(id)
    }
  }

  const openContribModal = (goal: SavingsGoal) => {
    setActiveGoalForContrib(goal)
    setContribFormData({ amount: "", account_id: "", date: new Date().toISOString().split('T')[0] })
    setIsContribModalOpen(true)
  }

  const handleContribSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeGoalForContrib) return
    setIsSubmittingContrib(true)

    const baseAmount = inputToBase(Number(contribFormData.amount), currency, rates)

    await addContribution({
      goal_id: activeGoalForContrib.id,
      amount: baseAmount,
      date: contribFormData.date,
      account_id: contribFormData.account_id || null
    })

    setIsSubmittingContrib(false)
    setIsContribModalOpen(false)
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Metas de Ahorro</h2>
          <p className="text-muted-foreground">Proyecta tus sueños y ahorra de manera inteligente.</p>
        </div>
        <Button onClick={() => openGoalModal()} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-select">
          <PlusCircle className="h-4 w-4" />
          Nueva Meta
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col h-[40vh] items-center justify-center border-2 border-dashed border-border/60 rounded-xl bg-card border-blue-500/20">
          <Target className="h-12 w-12 text-blue-500/50 mb-4" />
          <h3 className="text-lg font-medium">Sin metas definidas</h3>
          <p className="text-muted-foreground mb-4">Abre tu primera alcancía para ese viaje o proyecto soñado.</p>
          <Button onClick={() => openGoalModal()} variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-500">Crear Mi Primera Meta</Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map(goal => {
            const currentC = currency === "PEN" ? goal.current_amount : goal.current_amount * (rates[currency] || 1)
            const targetC = currency === "PEN" ? goal.target_amount : goal.target_amount * (rates[currency] || 1)
            const progress = Math.min((currentC / targetC) * 100, 100)
            const isCompleted = goal.status === 'completada' || progress >= 100

            return (
              <Card key={goal.id} className="premium-card relative overflow-hidden group border-t-4" style={{ borderTopColor: goal.color || "#3b82f6" }}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{goal.name}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1 mt-1">
                      <Target className="h-3 w-3" /> 
                      {goal.target_date ? `Objetivo: ${goal.target_date}` : "Sin fecha límite"}
                    </CardDescription>
                  </div>
                  <div className="flex bg-accent rounded-md">
                    <button onClick={() => openGoalModal(goal)} className="p-1.5 text-muted-foreground hover:text-white transition-colors" title="Editar">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Borrar">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ahorrado</p>
                      <h4 className="text-2xl font-bold" style={{ color: goal.color || "#3b82f6" }}>{formatCurrency(currentC, currency, { [currency]: 1 })}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Meta</p>
                      <p className="font-medium">{formatCurrency(targetC, currency, { [currency]: 1 })}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{progress.toFixed(1)}%</span>
                      {isCompleted && <span className="text-green-500 font-medium">¡Logrado!</span>}
                    </div>
                    <div className="h-2.5 w-full bg-accent rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${progress}%`, backgroundColor: goal.color || "#3b82f6" }}
                      />
                    </div>
                  </div>

                  {!isCompleted && (
                    <Button 
                      className="w-full mt-4 gap-2 border-dashed border-2 hover:bg-accent hover:text-foreground" 
                      variant="outline" 
                      onClick={() => openContribModal(goal)}
                    >
                      <PiggyBank className="h-4 w-4" />
                      Ingresar Aporte
                    </Button>
                  )}
                  {isCompleted && (
                    <div className="w-full mt-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
                       ¡Meta Completada! 🎉
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal Nueva Meta */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title={editingGoalId ? "Editar Meta de Ahorro" : "Nueva Meta de Ahorro"}
        description="Establece tu objetivo a futuro."
      >
        <form onSubmit={handleGoalSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre del Proyecto</label>
            <Input placeholder="Ej. Remodelación Cocina" required value={goalFormData.name} onChange={e => setGoalFormData({ ...goalFormData, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-sm font-medium">Monto Objetivo ({CURRENCY_SYMBOLS[currency]})</label>
              <Input type="number" step="0.01" min="1" placeholder="5000" required value={goalFormData.target_amount} onChange={e => setGoalFormData({ ...goalFormData, target_amount: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Límite (Opcional)</label>
              <DatePicker 
                date={goalFormData.target_date ? parseISO(goalFormData.target_date) : undefined}
                onChange={(date) => setGoalFormData({ ...goalFormData, target_date: date ? date.toISOString().split('T')[0] : "" })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Color Distintivo</label>
            <div className="flex gap-2">
               <Input type="color" className="w-12 h-10 p-1 cursor-pointer bg-background" value={goalFormData.color} onChange={e => setGoalFormData({ ...goalFormData, color: e.target.value })} />
               <Input className="flex-1" value={goalFormData.color} readOnly />
            </div>
          </div>
          
          {editingGoalId && (
            <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select value={goalFormData.status} onChange={e => setGoalFormData({ ...goalFormData, status: e.target.value })}>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
                </Select>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsGoalModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmittingGoal} className="bg-blue-600 hover:bg-blue-700 text-white border-transparent">
              {isSubmittingGoal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingGoalId ? "Actualizar Meta" : "Crear Meta"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Aportar */}
      <Modal
        isOpen={isContribModalOpen}
        onClose={() => setIsContribModalOpen(false)}
        title="Ingresar Aporte"
        description={activeGoalForContrib ? `Ahorrando para: ${activeGoalForContrib.name}` : ""}
      >
        <form onSubmit={handleContribSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cantidad a Aportar ({CURRENCY_SYMBOLS[currency]})</label>
            <Input type="number" step="0.01" min="0.1" autoFocus required value={contribFormData.amount} onChange={e => setContribFormData({ ...contribFormData, amount: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Restar de una Cuenta (Opcional)</label>
            <p className="text-xs text-muted-foreground mb-2">
              Si seleccionas una cuenta, el saldo de esta aportación se debitará de tu dinero real disponible en ella.
            </p>
            <Select value={contribFormData.account_id} onChange={e => setContribFormData({ ...contribFormData, account_id: e.target.value })}>
              <option value="">Aporte virtual (Solo sumar a meta sin descontar cuenta)</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} - {formatCurrency(currency === "PEN" ? acc.current_balance : acc.current_balance * (rates[currency] || 1), currency, { [currency]: 1 })}</option>
              ))}
            </Select>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsContribModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmittingContrib} className="bg-blue-600 border-blue-600 hover:bg-blue-700 text-white">
              {isSubmittingContrib && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aportar Fondos
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
