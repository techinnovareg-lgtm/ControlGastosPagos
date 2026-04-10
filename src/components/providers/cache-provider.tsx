"use client"

import * as React from "react"
import { usePayments } from "@/hooks/usePayments"
import { useIncomes } from "@/hooks/useIncomes"
import { useAccounts } from "@/hooks/useAccounts"
import { useCategories } from "@/hooks/useCategories"
import { useSavings } from "@/hooks/useSavings"
import { useDebts } from "@/hooks/useDebts"

export function GlobalCacheProvider({ children }: { children: React.ReactNode }) {
  // Iniciar todos los fetches al montar el layout principal
  const { refreshPayments } = usePayments()
  const { refreshIncomes } = useIncomes()
  const { refreshAccounts } = useAccounts()
  const { refreshCategories } = useCategories()
  const { refreshGoals } = useSavings()
  const { refreshDebts } = useDebts()

  React.useEffect(() => {
    // Estas funciones ya tienen lógica interna en los hooks 
    // para NO hacer nada si los datos ya están en Zustand,
    // a menos que se fuerce (cosa que no estamos haciendo aquí).
    
    // Al llamarlos aquí, nos aseguramos de que el fetch empiece lo antes posible
    // sin importar en qué página entre el usuario primero.
    const warmUpCache = async () => {
        try {
            await Promise.all([
                refreshPayments(),
                refreshIncomes(),
                refreshAccounts(),
                refreshCategories(),
                refreshGoals(),
                refreshDebts()
            ])
        } catch (e) {
            console.error("Cache warm up failed", e)
        }
    }
    
    warmUpCache()
  }, [])

  return <>{children}</>
}
