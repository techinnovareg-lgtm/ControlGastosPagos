"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useCacheStore } from "@/store/cache"

export type Debt = {
  id: string
  user_id: string
  debtor_name: string
  concept: string
  total_amount: number
  remaining_amount: number
  start_date: string
  status: string // 'pendiente' | 'en_progreso' | 'cancelado'
  created_at: string
}

export type DebtPayment = {
  id: string
  debt_id: string
  amount: number
  payment_date: string
  proof_url: string | null
  created_at: string
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
      const { data } = await supabase
        .from("debts")
        .select(`
          *,
          debt_payments (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data) setDebts(data)
    }
    setLoading(false)
  }

  const addDebt = async (debt: Partial<Debt>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from("debts")
      .insert([{ ...debt, user_id: user.id, remaining_amount: debt.total_amount }])
      .select()
      .single()

    if (!error && data) {
      setDebts([data, ...debts])
    }
    return { data, error }
  }

  const updateDebt = async (id: string, updates: Partial<Debt>) => {
    const { data, error } = await supabase
      .from("debts")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) {
      setDebts(debts.map(d => d.id === id ? data : d))
    }
    return { data, error }
  }

  const deleteDebt = async (id: string) => {
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
    let proofUrl = null

    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
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
    }

    const { data, error } = await supabase
      .from("debt_payments")
      .insert([{ 
        debt_id: debtId, 
        amount, 
        payment_date: paymentDate || new Date().toISOString().split("T")[0],
        proof_url: proofUrl
      }])
      .select()
      .single()

    if (!error) {
      await fetchDebts(true)
    }
    return { data, error }
  }

  const updateDebtPayment = async (paymentId: string, updates: Partial<DebtPayment>) => {
    const { data, error } = await supabase
      .from("debt_payments")
      .update(updates)
      .eq("id", paymentId)
      .select()
      .single()

    if (!error) {
      await fetchDebts(true)
    }
    return { data, error }
  }

  const deleteDebtPayment = async (paymentId: string) => {
    const { error } = await supabase
      .from("debt_payments")
      .delete()
      .eq("id", paymentId)

    if (!error) {
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
