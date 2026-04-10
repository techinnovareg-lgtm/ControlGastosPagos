# Guía de Configuración Paso a Paso - ControlGastosPagos

Sigue estos pasos para poner en marcha tu aplicación SaaS financiera.

## 1. Configuración de Supabase
1. Ve a [Supabase](https://supabase.com/) y crea un nuevo proyecto.
2. En el **SQL Editor**, crea un nuevo query y pega el contenido de `supabase_schema.sql`.
3. Ejecuta el script para crear todas las tablas, relaciones y políticas de seguridad (RLS).
4. Ve a **Project Settings > API** y copia la `Project URL` y la `anon public API key`. Las necesitaremos para el archivo `.env.local`.

## 2. Configuración de EmailJS
1. Crea una cuenta en [EmailJS](https://www.emailjs.com/).
2. Crea un **Email Service** (ej. Gmail).
3. Crea un **Email Template** para las alertas de vencimiento. Usa variables como `{{user_name}}`, `{{payment_name}}`, y `{{due_date}}`.
4. Copia tu `Service ID`, `Template ID` y `Public Key`.

## 3. Inicialización del Proyecto Local
1. Abre tu terminal en la carpeta del proyecto.
2. Crearemos la estructura base de Next.js:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```
3. Instala las dependencias adicionales:
   ```bash
   npm install @supabase/auth-helpers-nextjs @supabase/supabase-js lucide-react fullcalendar @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @emailjs/browser recharts clsx tailwind-merge
   ```

## 4. Variables de Entorno
Crea un archivo `.env.local` en la raíz con el siguiente contenido:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key
```

## 5. Próximos Pasos
Una vez configurado, procederemos a crear:
- Componentes del Design System (Botones, Cards, Inputs).
- Páginas de Autenticación.
- El Dashboard interactivo y Calendario.
