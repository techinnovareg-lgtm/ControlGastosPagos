"use client"

import * as React from "react"
import Image from "next/image"
import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-card/30 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Desarrollado por
          </p>
          <div className="relative h-12 w-48 opacity-80 hover:opacity-100 transition-opacity">
            <Image
              src="/brand/tech-innova.png"
              alt="Tech Innova Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-sm text-muted-foreground">
          <p className="font-medium">¿Necesitas soporte técnico?</p>
          <a
            href="mailto:tech.innova.reg@gmail.com"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-bold"
          >
            <Mail className="h-4 w-4" />
            tech.innova.reg@gmail.com
          </a>
          <p className="text-[10px] mt-2 opacity-50">
            © 2026 Tech Innova. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
