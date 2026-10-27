"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  LayoutDashboard,
  CreditCard,
  Banknote,
  Landmark,
  CalendarDays,
  PieChart,
  Wallet,
  Globe,
  Tags,
  Target,
  ShieldAlert
} from "lucide-react"

import { useCurrency } from "@/hooks/useCurrency"
import { CurrencyCode } from "@/lib/currency"

const baseNavigation = [
  { name: "Resumen", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mis Ingresos", href: "/dashboard/incomes", icon: Wallet },
  { name: "Metas de Ahorro", href: "/dashboard/savings", icon: Target },
  { name: "Pagos & Gastos", href: "/dashboard/payments", icon: CreditCard },
  { name: "Deudas por Cobrar", href: "/dashboard/debts", icon: Banknote },
  { name: "Mis Cuentas", href: "/dashboard/accounts", icon: Landmark },
  { name: "Categorías", href: "/dashboard/categories", icon: Tags },
  { name: "Calendario", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Reportes", href: "/dashboard/reports", icon: PieChart },
]

export function Sidebar({ userRole = "user" }: { userRole?: string }) {
  const pathname = usePathname()
  const { currency, setCurrency, fetchRates } = useCurrency()

  const isSuperAdmin = userRole === "superadmin" || userRole === "admin"

  React.useEffect(() => {
    fetchRates()
  }, [fetchRates])

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card px-4 py-6">
      <div className="flex justify-center px-4 pb-8 pt-4">
        <Link href="/dashboard" className="relative w-full max-w-[180px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 hover:shadow-indigo-500/20 hover:scale-105">
          <Image
            src="/brand/logo-dark.png"
            alt="Control Total Logo"
            width={180}
            height={70}
            className="w-full h-auto object-contain brightness-110"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {/* Acceso Especial Superadmin (Solo visible para Administradores) */}
        {isSuperAdmin && (
          <div className="pb-3 mb-2 border-b border-border/50">
            <Link
              href="/dashboard/admin"
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold transition-all duration-200 border",
                pathname === "/dashboard/admin"
                  ? "bg-purple-600/15 text-purple-400 border-purple-500/30 shadow-md shadow-purple-500/10"
                  : "bg-purple-500/5 text-purple-400/90 hover:bg-purple-500/10 border-purple-500/20"
              )}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-4 w-4 text-purple-400" />
                <span>Panel Superadmin</span>
              </div>
              <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PIN
              </span>
            </Link>
          </div>
        )}

        {/* Menú regular de la plataforma */}
        {baseNavigation.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Selector de Monedas */}
      <div className="mt-auto pt-6 pb-2">
        <div className="flex items-center justify-between px-3 py-2 bg-accent/20 rounded-lg text-sm border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span className="font-medium">Moneda Base</span>
          </div>
          <select
            className="bg-transparent border-none text-right font-bold text-foreground focus:ring-0 cursor-pointer outline-none"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          >
            <option value="PEN" className="bg-background">PEN</option>
            <option value="USD" className="bg-background">USD</option>
            <option value="EUR" className="bg-background">EUR</option>
          </select>
        </div>
      </div>
    </div>
  )
}
