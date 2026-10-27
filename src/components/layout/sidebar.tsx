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
  ShieldAlert,
  ArrowRight,
  UserCheck
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
    <div className="flex h-full w-64 flex-col border-r border-slate-200/90 bg-white px-4 py-5 shadow-sm">
      
      {/* 1. Logo en Rectángulo Blanco con Borde Suave */}
      <div className="px-0 pb-6 pt-1">
        <Link 
          href={isSuperAdmin ? "/dashboard/admin" : "/dashboard"}
          className="w-full bg-white border border-slate-200/90 hover:border-indigo-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="relative h-10 w-10 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/brand/controltotal-icon.svg"
              alt="ControlTotal Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
              Control<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Total</span>
            </span>
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
              BY TECH INNOVA
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        
        {/* Acceso Especial Superadmin (Solo visible para Administradores) */}
        {isSuperAdmin && (
          <div className="pb-3 mb-3 border-b border-slate-100 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600 px-3 py-1 flex items-center justify-between">
              <span>Administración</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 text-[9px] border border-purple-200">
                Superadmin
              </span>
            </div>

            <Link
              href="/dashboard/admin"
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 border",
                pathname === "/dashboard/admin"
                  ? "bg-purple-50 text-purple-800 border-purple-200 shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-purple-50/70 hover:text-purple-700 border-slate-200/80"
              )}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-4 w-4 text-purple-600" />
                <span>Gestión de Cuentas</span>
              </div>
              <span className="text-[10px] font-semibold text-purple-600">
                Panel
              </span>
            </Link>
          </div>
        )}

        {/* Encabezado Finanzas Personales para Superadmin */}
        {isSuperAdmin && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-1 pb-1">
            Mis Finanzas Personales
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
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-bold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Selector de Monedas */}
      <div className="mt-auto pt-4 pb-1">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Globe className="h-4 w-4 text-indigo-600" />
            <span className="font-semibold">Moneda Base</span>
          </div>
          <select
            className="bg-transparent border-none text-right font-bold text-slate-900 focus:ring-0 cursor-pointer outline-none"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          >
            <option value="PEN" className="bg-white">PEN</option>
            <option value="USD" className="bg-white">USD</option>
            <option value="EUR" className="bg-white">EUR</option>
          </select>
        </div>
      </div>
    </div>
  )
}
