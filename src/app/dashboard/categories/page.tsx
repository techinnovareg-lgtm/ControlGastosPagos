"use client"

import * as React from "react"
import { useCategories, Category } from "@/hooks/useCategories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Card, CardContent } from "@/components/ui/card"
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Loader2, 
  Search,
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Heart,
  Play,
  Laptop,
  Briefcase,
  Zap,
  Gift,
  Smartphone,
  TrendingUp,
  School,
  Tags,
  Check
} from "lucide-react"

const iconList = [
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Utensils", icon: Utensils },
  { name: "Car", icon: Car },
  { name: "Home", icon: Home },
  { name: "Heart", icon: Heart },
  { name: "Play", icon: Play },
  { name: "Laptop", icon: Laptop },
  { name: "Briefcase", icon: Briefcase },
  { name: "Zap", icon: Zap },
  { name: "Gift", icon: Gift },
  { name: "Smartphone", icon: Smartphone },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "School", icon: School },
  { name: "Tags", icon: Tags },
]

const colorList = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange
  "#71717a", // Zinc
]

export default function CategoriesPage() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    name: "",
    icon: "Tags",
    color: "#6366f1",
  })

  const openModal = (category: Category | null = null) => {
    if (category) {
      setEditingId(category.id)
      setFormData({
        name: category.name,
        icon: category.icon || "Tags",
        color: category.color || "#6366f1",
      })
    } else {
      setEditingId(null)
      setFormData({
        name: "",
        icon: "Tags",
        color: "#6366f1",
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return
    
    setIsSubmitting(true)
    if (editingId) {
      await updateCategory(editingId, formData)
    } else {
      await addCategory(formData)
    }
    setIsSubmitting(false)
    setIsModalOpen(false)
  }

  const handleDelete = async (category: Category) => {
    if (category.user_id === null) {
      alert("No puedes eliminar categorías del sistema.")
      return
    }
    if (confirm(`¿Eliminar la categoría "${category.name}"? Los gastos asociados quedarán sin categoría.`)) {
      await deleteCategory(category.id)
    }
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
          <p className="text-muted-foreground">Personaliza tus etiquetas para organizar mejor tus finanzas.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2 shadow-lg shadow-indigo-500/20">
          <PlusCircle className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar categorías..." 
          className="pl-10 bg-card/50" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category) => {
            const IconComponent = iconList.find(i => i.name === category.icon)?.icon || Tags
            const isSystem = category.user_id === null

            return (
              <Card key={category.id} className="group relative overflow-hidden premium-card transition-all hover:scale-[1.02]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: `${category.color}20`, color: category.color || "#6366f1" }}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {isSystem && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-accent/50 px-1.5 py-0.5 rounded">
                        Sistema
                      </span>
                    )}
                  </div>
                  
                  {!isSystem && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(category)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(category)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </CardContent>
                <div 
                  className="absolute bottom-0 left-0 h-1 w-full opacity-50"
                  style={{ backgroundColor: category.color || "#6366f1" }}
                />
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Editar Categoría" : "Nueva Categoría"}
        description="Elige un nombre, icono y color para tu nueva categoría."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre</label>
            <Input 
              placeholder="Ej. Restaurantes, Gimnasio..." 
              required 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Icono</label>
            <div className="grid grid-cols-7 gap-2">
              {iconList.map((item) => {
                const Icon = item.icon
                const isSelected = formData.icon === item.name
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: item.name })}
                    className={`p-2 rounded-lg border transition-all ${
                      isSelected 
                        ? "border-primary bg-primary/10 text-primary scale-110 shadow-sm" 
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorList.map((color) => {
                const isSelected = formData.color === color
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className="h-8 w-8 rounded-full border border-black/10 transition-transform hover:scale-110 flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    {isSelected && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border flex items-center gap-4">
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${formData.color}20`, color: formData.color }}
            >
              {React.createElement(iconList.find(i => i.name === formData.icon)?.icon || Tags, { className: "h-5 w-5" })}
            </div>
            <div className="font-bold text-lg">{formData.name || "Vista previa"}</div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Guardar cambios" : "Crear categoría"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
