"use client"

import * as React from "react"
import { usePayments } from "./usePayments"
import { useDebts } from "./useDebts"
import { formatCurrency } from "@/lib/currency"
import { useCurrency } from "./useCurrency"

import { createClient } from "@/lib/supabase"
import { parseISO, startOfDay, addDays, isSameDay, isPast } from "date-fns"

export type Notification = {
  id: string
  title: string
  body: string
  type: "payment" | "debt"
  date: string
  isRead: boolean
  critical: boolean
}

export function useNotifications() {
  const { payments } = usePayments()
  const { debts } = useDebts()
  const { currency, rates } = useCurrency()
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [hasNewAlerts, setHasNewAlerts] = React.useState(false)
  const supabase = createClient()

  const checkNotifications = React.useCallback(async () => {
    const alerts: Notification[] = []
    const today = startOfDay(new Date())
    const tomorrow = addDays(today, 1)

    // 1. Check Payments
    payments.forEach(p => {
      if (p.status === "pendiente") {
        const dueDate = startOfDay(parseISO(p.due_date))

        if (isSameDay(dueDate, today)) {
          alerts.push({
            id: `pay-${p.id}`,
            title: `Vence Hoy: ${p.name}`,
            body: `Recuerda pagar ${formatCurrency(p.amount, currency, rates)} el día de hoy.`,
            type: "payment",
            date: p.due_date,
            isRead: false,
            critical: true
          })
        } else if (isSameDay(dueDate, tomorrow)) {
          alerts.push({
            id: `pay-tom-${p.id}`,
            title: `Vence Mañana: ${p.name}`,
            body: `El pago de ${formatCurrency(p.amount, currency, rates)} está próximo a vencer.`,
            type: "payment",
            date: p.due_date,
            isRead: false,
            critical: true 
          })
        } else if (isPast(dueDate) && !isSameDay(dueDate, today)) {
          alerts.push({
            id: `pay-late-${p.id}`,
            title: `Pago Vencido: ${p.name}`,
            body: `Tienes un pago pendiente de ${formatCurrency(p.amount, currency, rates)} desde el ${p.due_date}.`,
            type: "payment",
            date: p.due_date,
            isRead: false,
            critical: true
          })
        }
      }
    })

    // 2. Check Debts
    debts.forEach(d => {
      if (d.remaining_amount > 0) {
        const debtDate = startOfDay(parseISO(d.start_date))
        
        if (isSameDay(debtDate, today)) {
          alerts.push({
            id: `debt-today-${d.id}`,
            title: `Nueva Deuda: ${d.debtor_name}`,
            body: `Hoy inicia la deuda por ${d.concept} de ${formatCurrency(d.total_amount, currency, rates)}.`,
            type: "debt",
            date: d.start_date,
            isRead: false,
            critical: true
          })
        } else if (isPast(debtDate) && d.remaining_amount === d.total_amount) {
          const daysStr = Math.floor((today.getTime() - debtDate.getTime()) / (1000 * 60 * 60 * 24))
          if (daysStr >= 15) {
            alerts.push({
              id: `debt-stale-${d.id}`,
              title: `Deuda Pendiente: ${d.debtor_name}`,
              body: `Han pasado ${daysStr} días sin abonos por ${d.concept}.`,
              type: "debt",
              date: d.start_date,
              isRead: false,
              critical: false
            })
          }
        }
      }
    })

    setNotifications(alerts.sort((a, b) => b.critical ? 1 : -1))
    const criticalFound = alerts.some(a => a.critical)
    setHasNewAlerts(criticalFound)


  }, [payments, debts, currency, rates, supabase])

  React.useEffect(() => {
    if (payments.length > 0 || debts.length > 0) {
      checkNotifications()
    }
  }, [payments, debts, checkNotifications])

  const markAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    setHasNewAlerts(false)
  }

  return {
    notifications,
    hasNewAlerts,
    markAsRead
  }
}
