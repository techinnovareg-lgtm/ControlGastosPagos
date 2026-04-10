"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Suponemos auto-confirm (config en Supabase)
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold gradient-text pb-1">Crea tu cuenta</h1>
        <p className="text-muted-foreground text-sm">
          Comienza a gestionar tu dinero inteligentemente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="fullName">
            Nombre completo
          </label>
          <Input id="fullName" name="fullName" type="text" placeholder="Juan Pérez" required disabled={loading} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            Correo electrónico
          </label>
          <Input id="email" name="email" type="email" placeholder="m@ejemplo.com" required disabled={loading} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Contraseña
          </label>
          <Input id="password" name="password" type="password" required disabled={loading} />
        </div>

        {error && (
          <div className="text-sm font-medium text-destructive">
            Obtuvimos un error: {error}
          </div>
        )}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>

      <div className="text-center text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Inicia sesión
        </Link>
      </div>
    </div>
  )
}
