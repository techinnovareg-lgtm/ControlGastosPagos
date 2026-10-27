"use client"

import * as React from "react"
import { ShieldAlert, Lock, CheckCircle2, KeyRound, Delete, RotateCcw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PinGuardProps {
  onUnlocked: () => void
  userEmail?: string
}

export function PinGuard({ onUnlocked, userEmail }: PinGuardProps) {
  const [pin, setPin] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [isSettingNewPin, setIsSettingNewPin] = React.useState(false)
  const [newPinStep, setNewPinStep] = React.useState<"enter" | "confirm">("enter")
  const [tempNewPin, setTempNewPin] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [shake, setShake] = React.useState(false)

  // Longitud estándar del PIN (4 dígitos)
  const PIN_LENGTH = 4

  // Manejo de pulsación en el teclado físico
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(e.key)
      } else if (e.key === "Backspace") {
        handleBackspace()
      } else if (e.key === "Escape") {
        handleClear()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pin, isSettingNewPin, newPinStep, tempNewPin])

  const handleDigit = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      const nextPin = pin + digit
      setPin(nextPin)
      setError(null)

      if (nextPin.length === PIN_LENGTH) {
        // Enviar automáticamente cuando se completa
        processCompletedPin(nextPin)
      }
    }
  }

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1))
    setError(null)
  }

  const handleClear = () => {
    setPin("")
    setError(null)
  }

  const triggerError = (msg: string) => {
    setError(msg)
    setShake(true)
    setTimeout(() => {
      setShake(false)
      setPin("")
    }, 600)
  }

  const processCompletedPin = async (completedPin: string) => {
    // Si estamos en modo configurar nuevo PIN
    if (isSettingNewPin) {
      if (newPinStep === "enter") {
        setTempNewPin(completedPin)
        setPin("")
        setNewPinStep("confirm")
        return
      } else if (newPinStep === "confirm") {
        if (completedPin !== tempNewPin) {
          triggerError("Los PINs no coinciden. Intenta de nuevo.")
          setNewPinStep("enter")
          setTempNewPin("")
          return
        }

        // Guardar nuevo PIN en backend
        setLoading(true)
        try {
          const res = await fetch("/api/admin/pin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "set", pin: completedPin }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error)

          setIsSettingNewPin(false)
          setNewPinStep("enter")
          setTempNewPin("")
          onUnlocked()
        } catch (err: any) {
          triggerError(err.message || "Error al guardar el nuevo PIN")
        } finally {
          setLoading(false)
        }
        return
      }
    }

    // Modo Normal: Verificar PIN
    setLoading(true)
    try {
      const res = await fetch("/api/admin/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", pin: completedPin }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        triggerError("PIN incorrecto. (PIN inicial de respaldo: 2026)")
      } else {
        onUnlocked()
      }
    } catch (err: any) {
      triggerError("Error al verificar PIN de seguridad.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4 text-center">
      <div
        className={`w-full max-w-sm rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-indigo-950/10 p-7 sm:p-8 relative transition-transform ${
          shake ? "animate-shake" : ""
        }`}
      >
        {/* Ícono de Escudo / Candado */}
        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <KeyRound className="h-8 w-8" />
        </div>

        {/* Título y Subtítulo */}
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          {isSettingNewPin
            ? newPinStep === "enter"
              ? "Crear PIN de Seguridad"
              : "Confirmar Nuevo PIN"
            : "Verificación de Seguridad"}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          {isSettingNewPin
            ? newPinStep === "enter"
              ? "Ingresa 4 dígitos para tu nuevo PIN administrativo"
              : "Vuelve a ingresar los 4 dígitos para confirmarlo"
            : "Ingresa tu PIN de autorización administrativa (PIN inicial: 2026)"}
        </p>

        {/* Círculos Indicadores de Dígitos */}
        <div className="flex justify-center items-center gap-3.5 my-7">
          {Array.from({ length: PIN_LENGTH }).map((_, idx) => {
            const isFilled = idx < pin.length
            return (
              <div
                key={idx}
                className={`h-4 w-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? "bg-indigo-600 scale-125 shadow-md shadow-indigo-500/30"
                    : "bg-slate-200 border border-slate-300"
                }`}
              />
            )
          })}
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center justify-center gap-1.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Teclado Numérico Interactivo */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              disabled={loading}
              onClick={() => handleDigit(num.toString())}
              className="h-14 w-14 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 border border-slate-200 text-lg font-bold text-slate-800 transition-all flex items-center justify-center shadow-sm"
            >
              {num}
            </button>
          ))}

          {/* Fila Inferior: Limpiar, 0, Borrar */}
          <button
            type="button"
            disabled={loading}
            onClick={handleClear}
            className="h-14 w-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200 text-xs font-bold text-slate-500 transition-all flex items-center justify-center shadow-sm"
            title="Limpiar"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleDigit("0")}
            className="h-14 w-14 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 border border-slate-200 text-lg font-bold text-slate-800 transition-all flex items-center justify-center shadow-sm"
          >
            0
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleBackspace}
            className="h-14 w-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200 text-xs font-bold text-slate-500 transition-all flex items-center justify-center shadow-sm"
            title="Borrar dígito"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>

        {/* Toggle para Configurar Nuevo PIN */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSettingNewPin(!isSettingNewPin)
              setNewPinStep("enter")
              setTempNewPin("")
              setPin("")
              setError(null)
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {isSettingNewPin ? "← Volver a Ingresar PIN Actual" : "¿Deseas cambiar o configurar tu PIN?"}
          </button>
        </div>
      </div>
    </div>
  )
}
