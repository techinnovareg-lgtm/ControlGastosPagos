"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useCacheStore } from "@/store/cache"

export type Account = {
  id: string
  user_id: string
  name: string
  type: string
  initial_balance: number
  current_balance: number
  created_at: string
}

export function useAccounts() {
  const supabase = createClient()
  const { accounts, accountsLoaded, setAccounts } = useCacheStore()
  const [loading, setLoading] = React.useState(!accountsLoaded)

  const fetchAccounts = async (force = false) => {
    if (accountsLoaded && !force) {
      setLoading(false)
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      
      if (data) setAccounts(data)
    }
    setLoading(false)
  }

  const addAccount = async (account: Partial<Account>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from("accounts")
      .insert([{ ...account, user_id: user.id }])
      .select()
      .single()

    if (!error && data) {
      setAccounts([data, ...accounts])
    }
    return { data, error }
  }

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    const { data, error } = await supabase
      .from("accounts")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) {
      setAccounts(accounts.map(acc => acc.id === id ? data : acc))
    }
    return { data, error }
  }

  const deleteAccount = async (id: string) => {
    const { error } = await supabase
      .from("accounts")
      .delete()
      .eq("id", id)

    if (!error) {
      setAccounts(accounts.filter(acc => acc.id !== id))
    }
    return { error }
  }

  React.useEffect(() => {
    if (!accountsLoaded) {
      fetchAccounts()
    }
  }, [accountsLoaded])

  return {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    refreshAccounts: fetchAccounts
  }
}
