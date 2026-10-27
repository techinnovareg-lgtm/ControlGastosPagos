"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useCacheStore } from "@/store/cache"

export type DebtPayment = {
  id: string
  debt_id: string
  amount: number
  payment_date: string
  proof_url?: string | null
  created_at: string
}

export type Debt = {
  id: string
  user_id: string
  debtor_name: string
  concept: string
  total_amount: number
  remaining_amount: number
  start_date: string
  status: "pendiente" | "en_progreso" | "cancelado"
  created_at: string
  debt_payments?: DebtPayment[]
}

export function useDebts() {
  const supabase = createClient()
  const { debts, debtsLoaded, setDebts } = useCacheStore()
  const [loading, setLoading] = React.useState(!debtsLoaded)

  const fetchDebts = async (force = false) => {
    if (debtsLoaded && !force) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data, error } = await supabase
        .from("debts")
        .select(`
          *,
          debt_payments (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setDebts(data)
      }
    }
    setLoading(false)
  }

  const addDebt = async (debt: Partial<Debt>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: new Error("No autenticado") }

    const initialAmount = Number(debt.total_amount) || 0
    const payload = {
      debtor_name: debt.debtor_name,
      concept: debt.concept,
      total_amount: initialAmount,
      remaining_amount: initialAmount,
      start_date: debt.start_date || new Date().toISOString().split("T")[0],
      status: (debt.status as any) || "pendiente",
      user_id: user.id
    }

    const { data, error } = await supabase
      .from("debts")
      .insert([payload])
      .select(`
        *,
        debt_payments (*)
      `)
      .single()

    if (!error && data) {
      const newDebt = { ...data, debt_payments: [] }
      setDebts([newDebt, ...debts])
    }
    return { data, error }
  }

  const updateDebt = async (id: string, updates: Partial<Debt>) => {
    const currentDebt = debts.find(d => d.id === id)
    const existingPayments: DebtPayment[] = (currentDebt as any)?.debt_payments || []

    const cleanUpdates: any = {}
    if (updates.debtor_name !== undefined) cleanUpdates.debtor_name = updates.debtor_name
    if (updates.concept !== undefined) cleanUpdates.concept = updates.concept
    if (updates.start_date !== undefined) cleanUpdates.start_date = updates.start_date

    // Recalcular saldo si se modifica el monto total
    if (updates.total_amount !== undefined) {
      const newTotal = Number(updates.total_amount) || 0
      cleanUpdates.total_amount = newTotal

      const totalPaid = existingPayments.reduce((sum, p) => sum + Number(p.amount), 0)
      const newRemaining = Math.max(0, newTotal - totalPaid)
      cleanUpdates.remaining_amount = newRemaining

      if (!updates.status) {
        cleanUpdates.status = newRemaining <= 0 ? "cancelado" : (totalPaid > 0 ? "en_progreso" : "pendiente")
      }
    }

    if (updates.status !== undefined) {
      cleanUpdates.status = updates.status
    }

    const { data, error } = await supabase
      .from("debts")
      .update(cleanUpdates)
      .eq("id", id)
      .select(`
        *,
        debt_payments (*)
      `)
      .single()

    if (!error && data) {
      const mergedDebt = {
        ...data,
        debt_payments: data.debt_payments && data.debt_payments.length > 0 ? data.debt_payments : existingPayments
      }
      setDebts(debts.map(d => d.id === id ? mergedDebt : d))
    }
    return { data, error }
  }

  const deleteDebt = async (id: string) => {
    // Eliminar pagos asociados primero para prevenir problemas de FK
    await supabase.from("debt_payments").delete().eq("debt_id", id)

    const { error } = await supabase
      .from("debts")
      .delete()
      .eq("id", id)

    if (!error) {
      setDebts(debts.filter(d => d.id !== id))
    }
    return { error }
  }

  const addDebtPayment = async (debtId: string, amount: number, paymentDate: string, file?: File) => {
    let proofUrl: string | null = null

    if (file) {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${debtId}/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('debt-proofs')
          .upload(filePath, file)

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('debt-proofs')
            .getPublicUrl(filePath)
          proofUrl = publicUrl
        }
      } catch (err) {
        console.warn("Comprobante omitido por storage:", err)
      }
    }

    // Armamos el payload SIN proof_url si es nulo, para evitar error si la columna no existe
    const insertPayload: any = { 
      debt_id: debtId, 
      amount: Number(amount), 
      payment_date: paymentDate || new Date().toISOString().split("T")[0]
    }
    if (proofUrl) {
      insertPayload.proof_url = proofUrl
    }

    let { data, error } = await supabase
      .from("debt_payments")
      .insert([insertPayload])
      .select()
      .single()

    // Si falló porque la columna proof_url no existe en la base de datos, reintentar sin ella
    if (error && error.code === 'PGRST204' && insertPayload.proof_url) {
      delete insertPayload.proof_url
      const retry = await supabase
        .from("debt_payments")
        .insert([insertPayload])
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    if (!error && data) {
      // Recalcular saldo y estado de la deuda de manera infalible
      const { data: allPayments } = await supabase
        .from("debt_payments")
        .select("amount")
        .eq("debt_id", debtId)

      const targetDebt = debts.find(d => d.id === debtId)
      if (targetDebt) {
        const paymentsList = allPayments || [{ amount }]
        const totalPaid = paymentsList.reduce((sum, p) => sum + Number(p.amount), 0)
        const newRemaining = Math.max(0, Number(targetDebt.total_amount) - totalPaid)
        const newStatus = newRemaining <= 0 ? "cancelado" : "en_progreso"

        await supabase
          .from("debts")
          .update({ remaining_amount: newRemaining, status: newStatus })
          .eq("id", debtId)
      }

      await fetchDebts(true)
    }

    return { data, error }
  }

  const updateDebtPayment = async (debtId: string, paymentId: string, updates: Partial<DebtPayment>) => {
    const cleanUpdates: any = {}
    if (updates.amount !== undefined) cleanUpdates.amount = Number(updates.amount)
    if (updates.payment_date !== undefined) cleanUpdates.payment_date = updates.payment_date

    const { data, error } = await supabase
      .from("debt_payments")
      .update(cleanUpdates)
      .eq("id", paymentId)
      .select()
      .single()

    if (!error) {
      const { data: allPayments } = await supabase
        .from("debt_payments")
        .select("amount")
        .eq("debt_id", debtId)

      const targetDebt = debts.find(d => d.id === debtId)
      if (targetDebt && allPayments) {
        const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0)
        const newRemaining = Math.max(0, Number(targetDebt.total_amount) - totalPaid)
        const newStatus = newRemaining <= 0 ? "cancelado" : (totalPaid > 0 ? "en_progreso" : "pendiente")

        await supabase
          .from("debts")
          .update({ remaining_amount: newRemaining, status: newStatus })
          .eq("id", debtId)
      }

      await fetchDebts(true)
    }

    return { data, error }
  }

  const deleteDebtPayment = async (debtId: string, paymentId: string) => {
    const { error } = await supabase
      .from("debt_payments")
      .delete()
      .eq("id", paymentId)

    if (!error) {
      const { data: allPayments } = await supabase
        .from("debt_payments")
        .select("amount")
        .eq("debt_id", debtId)

      const targetDebt = debts.find(d => d.id === debtId)
      if (targetDebt) {
        const paymentsList = allPayments || []
        const totalPaid = paymentsList.reduce((sum, p) => sum + Number(p.amount), 0)
        const newRemaining = Math.max(0, Number(targetDebt.total_amount) - totalPaid)
        const newStatus = newRemaining <= 0 ? "cancelado" : (totalPaid > 0 ? "en_progreso" : "pendiente")

        await supabase
          .from("debts")
          .update({ remaining_amount: newRemaining, status: newStatus })
          .eq("id", debtId)
      }

      await fetchDebts(true)
    }

    return { error }
  }

  React.useEffect(() => {
    if (!debtsLoaded) {
      fetchDebts()
    }
  }, [debtsLoaded])

  return {
    debts,
    loading,
    addDebt,
    updateDebt,
    deleteDebt,
    addDebtPayment,
    updateDebtPayment,
    deleteDebtPayment,
    refreshDebts: fetchDebts,
  }
}
