"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useCacheStore } from "@/store/cache"

export type SavingsGoal = {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string | null
  status: string // 'en_progreso' | 'completada'
  color: string | null
  created_at: string
}

export type SavingContribution = {
  id: string
  goal_id: string
  amount: number
  date: string
  account_id: string | null
  created_at: string
}

export function useSavings() {
  const supabase = createClient()
  const { savingsGoals: goals, savingsLoaded: goalsLoaded, setSavings: setGoals } = useCacheStore()
  const [loading, setLoading] = React.useState(!goalsLoaded)

  const fetchGoals = async (force = false) => {
    if (goalsLoaded && !force) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data) {
        setGoals(data)
      }
    }
    setLoading(false)
  }

  const addGoal = async (goal: Partial<SavingsGoal>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "No user" }

    const { data, error } = await supabase
      .from("savings_goals")
      .insert({ ...goal, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setGoals([data, ...goals])
    }
    return { data, error }
  }

  const updateGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    const { data, error } = await supabase
      .from("savings_goals")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) {
      setGoals(goals.map(g => g.id === id ? data : g))
    }
    return { data, error }
  }

  const deleteGoal = async (id: string) => {
    const { error } = await supabase
      .from("savings_goals")
      .delete()
      .eq("id", id)

    if (!error) {
      setGoals(goals.filter(g => g.id !== id))
    }
    return { error }
  }

  const addContribution = async (contribution: Partial<SavingContribution>) => {
    // El trigger en PostgreSQL actualizará current_amount en el savings_goal
    // y restará el saldo del account (si se envió account_id).
    const { data, error } = await supabase
      .from("saving_contributions")
      .insert(contribution)
      .select()
      .single()

    if (!error && data) {
      const { invalidateAccounts } = useCacheStore.getState()
      invalidateAccounts()
      
      // Necesitamos refrescar la meta localmente para reflejar el nuevo curren_amount
      const { data: updatedGoal } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("id", contribution.goal_id)
        .single()
        
      if (updatedGoal) {
        setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g))
      }
    }
    return { data, error }
  }

  React.useEffect(() => {
    if (!goalsLoaded) {
      fetchGoals()
    }
  }, [goalsLoaded])

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    refreshGoals: fetchGoals,
  }
}
