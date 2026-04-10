"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold gradient-text pb-1">Bienvenido de vuelta</h1>
        <p className="text-muted-foreground text-sm">
          Ingresa tus credenciales para acceder a tu control de gastos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
            Correo electrónico
          </label>
          <Input id="email" name="email" type="email" placeholder="m@ejemplo.com" required disabled={loading} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
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
          Iniciar sesión
        </Button>
      </form>

      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Regístrate aquí
        </Link>
      </div>
    </div>
  )
}
