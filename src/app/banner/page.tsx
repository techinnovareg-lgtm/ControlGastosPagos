import React from 'react'

export const metadata = {
  title: 'Generador de Banner 16:9',
  description: 'Vista limpia para capturar el banner del portafolio',
}

export default function BannerPage() {
  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* Contenedor del Banner 16:9 - 1280x720 aproximado */}
      <div 
        className="relative bg-card flex flex-col justify-center overflow-hidden rounded-2xl shadow-2xl border border-white/5"
        style={{ width: '1280px', height: '720px' }}
      >
        {/* Efectos de fondo abstracto y líneas de código */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Luces led neón difuminadas simuladas */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        
        {/* Contenido Superior / Header falso simulando la app */}
        <div className="absolute top-0 left-0 w-full h-[80px] border-b border-white/5 bg-background/50 backdrop-blur-md flex items-center px-10">
          <div className="w-[180px] h-[60px] relative">
            {/* Se asume que logo-dark.png fue copiado a public/brand/ por el script previo */}
            <img src="/brand/logo-dark.png" alt="Control Total Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Cajas UI Falsas estilo Dashboard Minimalista en el fondo */}
        <div className="absolute right-20 top-[150px] w-80 h-40 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl -rotate-6 transform shadow-2xl" />
        <div className="absolute right-10 bottom-[100px] w-[500px] h-[300px] bg-white/5 border border-indigo-500/20 rounded-2xl backdrop-blur-md rotate-2 transform shadow-indigo-500/10" />

        <div className="z-10 px-24 py-16 flex flex-col items-start pt-[100px]">
          <span className="text-cyan-400 font-bold uppercase tracking-[0.3em] font-heading mb-4 text-xl">SaaS Platform</span>
          <h1 className="text-white text-[90px] font-extrabold font-heading leading-[1.1] tracking-tight mb-8">
            Control de<br/>
            Gastos y Pagos
          </h1>
          <p className="text-white/60 text-2xl font-light max-w-[600px] leading-relaxed mb-12">
            Sistema premium de gestión financiera personal y automatización de procesos contables.
          </p>
          
          <div className="flex gap-4 items-center">
            <span className="h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-white/80 font-medium">Arquitectura Moderna & Responsive</span>
          </div>
        </div>
      </div>
      
      {/* Instrucciones flotantes que no saldrán en la captura si lo hacen bien */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-medium shadow-xl opacity-50 hover:opacity-100 transition-opacity">
        💡 Entra en pantalla completa (F11), usa una herramienta de recorte sobre el rectángulo central y guarda tu banner.
      </div>
    </div>
  )
}
