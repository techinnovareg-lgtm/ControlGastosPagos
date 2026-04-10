"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useCacheStore } from "@/store/cache"

export type Payment = {
  id: string
  user_id: string
  account_id: string | null
  category_id: string | null
  name: string
  amount: number
  type: string // 'recurrente' | 'unico'
  frequency: string | null // 'mensual' | 'anual' | null
  due_date: string
  payment_method: string | null // 'automatico' | 'manual'
  status: string // 'pendiente' | 'pagado' | 'vencido'
  created_at: string
}

export function usePayments() {
  const supabase = createClient()
  const { payments, paymentsLoaded, setPayments } = useCacheStore()
  const [loading, setLoading] = React.useState(!paymentsLoaded)

  const fetchPayments = async (force = false) => {
    if (paymentsLoaded && !force) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true })

      if (data) {
        setPayments(data)
        // Ejecutar revisión silenciosa de automáticos vencidos
        processDueAutomaticPayments(data)
      }
    }
    setLoading(false)
  }

  const processDueAutomaticPayments = async (currentPayments: Payment[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const duePayments = currentPayments.filter(p => {
      if (p.status !== "pendiente" || new Date(p.due_date) > today) return false;
      
      let isAuto = false;
      try {
        const pm = JSON.parse(p.payment_method || "{}");
        isAuto = pm.auto;
      } catch {
        if (p.payment_method === "automatico") isAuto = true;
      }
      return isAuto;
    });

    if (duePayments.length > 0) {
      for (const p of duePayments) {
        await markAsPaid(p);
      }
      // Volver a cargar forzadamente para reflejar los estados actualizados
      fetchPayments(true);
    }
  }

  const addPayment = async (payment: Partial<Payment>, validity: number = 1) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const records = []
    
    // Generar N filas de acuerdo a la vigencia
    if (payment.type === "recurrente" && payment.frequency) {
      // payment.due_date ya viene en YYYY-MM-DD local
      const [year, month, day] = payment.due_date!.split('-').map(Number)
      
      for (let i = 0; i < validity; i++) {
        let nextDate = new Date(year, month - 1, day) // Meses son 0-indexed en Date
        
        if (payment.frequency === "semanal") {
          nextDate.setDate(nextDate.getDate() + (7 * i))
        } else if (payment.frequency === "quincenal") {
          nextDate.setDate(nextDate.getDate() + (15 * i))
        } else if (payment.frequency === "mensual") {
          nextDate.setMonth(nextDate.getMonth() + i)
        } else if (payment.frequency === "bimestral") {
          nextDate.setMonth(nextDate.getMonth() + (i * 2))
        } else if (payment.frequency === "trimestral") {
          nextDate.setMonth(nextDate.getMonth() + (i * 3))
        } else if (payment.frequency === "semestral") {
          nextDate.setMonth(nextDate.getMonth() + (i * 6))
        } else if (payment.frequency === "anual") {
          nextDate.setFullYear(nextDate.getFullYear() + i)
        }
        
        records.push({
          ...payment,
          user_id: user.id,
          due_date: `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`,
          status: "pendiente"
        })
      }
    } else {
      records.push({ ...payment, user_id: user.id })
    }

    const { data, error } = await supabase
      .from("payments")
      .insert(records)
      .select()

    if (!error && data) {
      setPayments([...data, ...payments].sort((a, b) => 
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      ))
    }
    return { data, error }
  }

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) {
      setPayments(payments.map(p => p.id === id ? data : p))
    }
    return { data, error }
  }

  const deletePayment = async (id: string) => {
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id)

    if (!error) {
      setPayments(payments.filter(p => p.id !== id))
    }
    return { error }
  }

  const markAsPaid = async (payment: Payment) => {
    // 1. Actualizar el estado del pago actual
    const { data, error } = await updatePayment(payment.id, { status: "pagado" })

    // 2. Si hay cuenta asociada, descontar el saldo
    if (!error && payment.account_id) {
      const { invalidateAccounts } = useCacheStore.getState() // Obtener acción del store
      const { data: account } = await supabase
        .from("accounts")
        .select("current_balance")
        .eq("id", payment.account_id)
        .single()

      if (account) {
        const newBalance = Number(account.current_balance) - payment.amount
        await supabase
          .from("accounts")
          .update({ current_balance: newBalance })
          .eq("id", payment.account_id)
        
        invalidateAccounts() // Marcamos para recarga en el próximo uso
      }
    }

    return { data, error }
  }

  React.useEffect(() => {
    if (!paymentsLoaded) {
      fetchPayments()
    }
  }, [paymentsLoaded])

  return {
    payments,
    loading,
    addPayment,
    updatePayment,
    deletePayment,
    markAsPaid,
    refreshPayments: fetchPayments,
  }
}
