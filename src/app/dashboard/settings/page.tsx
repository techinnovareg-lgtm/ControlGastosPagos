"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2, User, Key, Save, AlertCircle } from "lucide-react"

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [userId, setUserId] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState("")
  
  const [formData, setFormData] = React.useState({
    fullName: "",
  })
  
  const [passwordData, setPasswordData] = React.useState({
    newPassword: "",
    confirmPassword: "",
  })

  // Mensajes de feedback
  const [message, setMessage] = React.useState<{type: 'success'|'error', text: string} | null>(null)
  
  React.useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        setEmail(session.user.email || "")
        
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single()
          
        if (data && data.full_name) {
          setFormData({ fullName: data.full_name })
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    
    if (!userId) return
    
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, full_name: formData.fullName })
      
    if (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil.' })
    } else {
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente. (Recarga la página para ver cambios en menú)' })
      router.refresh()
    }
    setSaving(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' })
      setSaving(false)
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' })
      setSaving(false)
      return
    }
    
    const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword })
    
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' })
      setPasswordData({ newPassword: '', confirmPassword: '' })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">Gestiona la información de tu perfil y la seguridad de tu cuenta.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex gap-3 text-sm font-medium items-center ${
          message.type === 'error' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-success/10 text-success bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
        }`}>
          <AlertCircle className="h-4 w-4" />
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Perfil */}
        <Card className="premium-card">
          <form onSubmit={handleUpdateProfile}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Perfil Público
              </CardTitle>
              <CardDescription>
                Actualiza tu nombre para personalizar tu dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo Electrónico</label>
                <Input value={email} disabled className="bg-accent/50 cursor-not-allowed" />
                <p className="text-[11px] text-muted-foreground">Tu correo electrónico es el identificador principal y no se puede cambiar.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de Usuario / Alias</label>
                <Input 
                  placeholder="Ej. Admin, Carlos..." 
                  value={formData.fullName} 
                  required
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={saving} className="w-full sm:w-auto ml-auto">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Guardar Cambios
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Seguridad */}
        <Card className="premium-card">
          <form onSubmit={handleUpdatePassword}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" /> Contraseña
              </CardTitle>
              <CardDescription>
                Modifica tu contraseña de acceso para mantener la cuenta segura.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nueva Contraseña</label>
                <Input 
                  type="password" 
                  placeholder="Mínimo 6 caracteres" 
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar Contraseña</label>
                <Input 
                  type="password" 
                  placeholder="Repite la contraseña" 
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" variant="secondary" disabled={saving} className="w-full sm:w-auto ml-auto">
                Actualizar Seguridad
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      {/* Botón Peligro - Exportar / Borrar cuenta (UI Opcional o Placeholder) */}
      <Card className="border-destructive/20 bg-destructive/5 mt-8">
        <CardHeader>
          <CardTitle className="text-destructive font-medium text-lg">Zona de Peligro</CardTitle>
          <CardDescription>
            Opciones avanzadas y destructivas de tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">Exportar toda la Información</h4>
              <p className="text-xs text-muted-foreground mt-1">Saca una copia de todos tus registros financieros y configuraciones en formato de lectura.</p>
            </div>
            <Button variant="outline" disabled title="Pronto disponible">Solicitar Copia</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
