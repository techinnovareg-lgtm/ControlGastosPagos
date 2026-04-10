"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useCacheStore } from "@/store/cache"

export type Category = {
  id: string
  user_id: string | null
  name: string
  icon: string | null
  color: string | null
}

export function useCategories() {
  const supabase = createClient()
  const { categories, categoriesLoaded, setCategories } = useCacheStore()
  const [loading, setLoading] = React.useState(!categoriesLoaded)

  const fetchCategories = async (force = false) => {
    if (categoriesLoaded && !force) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Traer categorías compartidas (user_id is null) y las propias del usuario
    const { data } = await supabase
      .from("categories")
      .select("*")
      .or(`user_id.is.null,user_id.eq.${user?.id}`)
      .order("name", { ascending: true })

    if (data) setCategories(data)
    setLoading(false)
  }

  const addCategory = async (category: Partial<Category>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from("categories")
      .insert({ ...category, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name)))
    }
    return { data, error }
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) {
      setCategories(categories.map(c => c.id === id ? data : c).sort((a, b) => a.name.localeCompare(b.name)))
    }
    return { data, error }
  }

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)

    if (!error) {
      setCategories(categories.filter(c => c.id !== id))
    }
    return { error }
  }

  React.useEffect(() => {
    if (!categoriesLoaded) {
      fetchCategories()
    }
  }, [categoriesLoaded])

  return { 
    categories, 
    loading, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    refreshCategories: fetchCategories 
  }
}

