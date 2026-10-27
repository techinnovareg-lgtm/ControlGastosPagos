"use client"

import * as React from "react"
import { MessageCircle, X } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
}

export function WhatsAppButton({
  phoneNumber = "51912440927", // Número de soporte Tech Innova
  message = "Hola Tech Innova, deseo solicitar información y soporte sobre la plataforma ControlTotal."
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* Tooltip / Mensaje Flotante de Bienvenida */}
      {isOpen && (
        <div className="relative max-w-xs bg-white text-slate-800 p-3.5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/80 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-1.5 -left-1.5 h-5 w-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs shadow transition-colors"
            title="Cerrar aviso"
          >
            <X className="h-3 w-3" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wide uppercase text-emerald-600">
              Soporte Tech Innova
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-snug">
            ¿Tienes dudas o deseas atención personalizada? <strong>Escríbenos directamente por WhatsApp</strong>.
          </p>
        </div>
      )}

      {/* Botón Principal de WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar soporte de Tech Innova por WhatsApp"
        className="group relative flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Efecto de pulso en ondas concéntricas */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping -z-10" />

        {/* Ícono de WhatsApp SVG exacto */}
        <svg
          className="h-8 w-8 fill-current drop-shadow-sm"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>

        {/* Indicador de estado "Online" */}
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-white flex items-center justify-center shadow-md">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
      </a>
    </div>
  )
}
