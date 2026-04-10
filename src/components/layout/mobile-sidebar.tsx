"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import { Sidebar } from "./sidebar"
import { usePathname } from "next/navigation"

export function MobileSidebar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  // Cerrar al cambiar de ruta
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop con blur */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel Lateral Animado */}
          <div className="relative z-50 flex h-full w-64 flex-col bg-card shadow-2xl animate-in slide-in-from-left duration-300 border-r">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent z-50"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex-1 overflow-y-auto w-full h-full">
              {/* Reutilizamos el Sidebar pero ignoramos su border-r nativo porque ya le pusimos wrapper */}
              <Sidebar />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
