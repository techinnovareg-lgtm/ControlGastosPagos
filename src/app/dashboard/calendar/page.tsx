"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useCurrency } from "@/hooks/useCurrency"
import { formatCurrency } from "@/lib/currency"
import { usePayments } from "@/hooks/usePayments"

const statusColors: Record<string, string> = {
  pendiente: "#f59e0b",
  pagado: "#22c55e",
  vencido: "#ef4444",
}

export default function CalendarPage() {
  const { payments, loading } = usePayments()
  const [events, setEvents] = React.useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null)
  const { currency, rates } = useCurrency()

  React.useEffect(() => {
    if (payments.length > 0) {
      const calendarEvents = payments.map(payment => ({
        id: payment.id,
        title: payment.name,
        date: payment.due_date,
        backgroundColor: statusColors[payment.status] || statusColors.pendiente,
        borderColor: "transparent",
        extendedProps: {
          amount: payment.amount,
          status: payment.status,
          type: payment.type,
          frequency: payment.frequency,
        },
      }))
      setEvents(calendarEvents)
    }
  }, [payments])

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      title: info.event.title,
      date: info.event.startStr,
      ...info.event.extendedProps,
    })
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Calendario</h2>
        <p className="text-muted-foreground">Visualiza tus pagos agendados en un solo lugar.</p>
      </div>

      <Card className="premium-card">
        <CardContent className="p-4 sm:p-6">
          <div className="calendar-dark">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              locale="es"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día"
              }}
              height="auto"
              dayMaxEvents={3}
            />
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Detalle del Pago"
      >
        {selectedEvent && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{selectedEvent.title}</span>
              <Badge
                variant={
                  selectedEvent.status === "pagado"
                    ? "success"
                    : selectedEvent.status === "vencido"
                    ? "destructive"
                    : "warning"
                }
              >
                {selectedEvent.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Monto</span>
                <p className="font-semibold text-primary">{formatCurrency(selectedEvent.amount || 0, currency, rates)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha</span>
                <p className="font-medium">{selectedEvent.date}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tipo</span>
                <p className="capitalize">{selectedEvent.type}</p>
              </div>
              {selectedEvent.frequency && (
                <div>
                  <span className="text-muted-foreground">Frecuencia</span>
                  <p className="capitalize">{selectedEvent.frequency}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
