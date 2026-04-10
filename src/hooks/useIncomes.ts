"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useCacheStore } from "@/store/cache"

export type Income = {
  id: string
  user_id: string
  account_id: string | null
  category_id: string | null
  name: string
  amount: number
  type: string // 'recurrente' | 'unico'
  frequency: string | null // 'mensual' | 'anual' | null
  date: string
  status: string // 'pendiente' | 'recibido'
  created_at: string
}

export function useIncomes() {
  const supabase = createClient()
  const { incomes, incomesLoaded, setIncomes } = useCacheStore()
  const [loading, setLoading] = React.useState(!incomesLoaded)

  const fetchIncomes = async (force = false) => {
    if (incomesLoaded && !force) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from("incomes")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true })

      if (data) {
        setIncomes(data)
      }
    }
    setLoading(false)
  }

  const addIncome = async (income: Partial<Income>, validity: number = 1) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const records = []
    
    // Generar N filas para ingresos recurrentes
    if (income.type === "recurrente" && income.frequency && income.date) {
      const [year, month, day] = income.date.split('-').map(Number)
      
      for (let i = 0; i < validity; i++) {
        let nextDate = new Date(year, month - 1, day)
        
        if (income.frequency === "semanal") {
          nextDate.setDate(nextDate.getDate() + (7 * i))
        } else if (income.frequency === "quincenal") {
          nextDate.setDate(nextDate.getDate() + (15 * i))
        } else if (income.frequency === "mensual") {
          nextDate.setMonth(nextDate.getMonth() + i)
        } else if (income.frequency === "bimestral") {
          nextDate.setMonth(nextDate.getMonth() + (i * 2))
        } else if (income.frequency === "trimestral") {
          nextDate.setMonth(nextDate.getMonth() + (i * 3))
        } else if (income.frequency === "semestral") {
          nextDate.setMonth(nextDate.getMonth() + (i * 6))
        } else if (income.frequency === "anual") {
          nextDate.setFullYear(nextDate.getFullYear() + i)
        }
        
        records.push({
          ...income,
          user_id: user.id,
          date: `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`,
          status: "pendiente"
        })
      }
    } else {
      records.push({ ...income, user_id: user.id })
    }

    const { data, error } = await supabase
      .from("incomes")
      .insert(records)
      .select()

    if (!error && data) {
      setIncomes([...data, ...incomes].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ))
    }
    return { data, error }
  }

  const updateIncome = async (id: string, updates: Partial<Income>) => {
    const { data, error } = await supabase
      .from("incomes")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) {
      setIncomes(incomes.map(inc => inc.id === id ? data : inc))
    }
    return { data, error }
  }

  const deleteIncome = async (id: string) => {
    const { error } = await supabase
      .from("incomes")
      .delete()
      .eq("id", id)

    if (!error) {
      setIncomes(incomes.filter(inc => inc.id !== id))
    }
    return { error }
  }

  const markAsReceived = async (income: Income) => {
    // Solo actualizamos el estado. El TRIGGER SQL update_account_balance_on_income 
    // se encargará de incrementar el dinero en la cuenta elegida en Supabase.
    return await updateIncome(income.id, { status: "recibido" })
  }

  React.useEffect(() => {
    if (!incomesLoaded) {
      fetchIncomes()
    }
  }, [incomesLoaded])

  return {
    incomes,
    loading,
    addIncome,
    updateIncome,
    deleteIncome,
    markAsReceived,
    refreshIncomes: fetchIncomes,
  }
}
