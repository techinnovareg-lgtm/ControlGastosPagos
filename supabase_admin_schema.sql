-- ==============================================================
-- MIGRACIÓN DEFINITIVA: ROLES, SUPERADMIN Y POLÍTICAS SIN RECURSIÓN
-- ControlTotal SaaS by Tech Innova
-- ==============================================================

-- 1. Agregar columnas a profiles si no existen
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS security_pin TEXT DEFAULT '2026',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Eliminar políticas conflictivas anteriores si existen
DROP POLICY IF EXISTS "Admins can view and manage all profiles" ON public.profiles;

-- 3. Función auxiliar SECURITY DEFINER (Vital para evitar recursión RLS en Postgres)
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role IN ('admin', 'superadmin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Nueva política para administradores sin recursión
CREATE POLICY "Admins can view and manage all profiles"
  ON public.profiles FOR ALL
  USING (
    auth.uid() = id OR public.check_is_admin()
  );

-- 5. Asignar superadmin a la cuenta principal
UPDATE public.profiles
SET role = 'superadmin', plan = 'business', status = 'active', security_pin = '2026'
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('tech.innova.reg@gmail.com', 'carlos.amambal@gmail.com')
);

-- 6. Trigger para asignar automáticamente superadmin en nuevos registros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT := 'user';
BEGIN
  IF new.email IN ('tech.innova.reg@gmail.com', 'carlos.amambal@gmail.com') THEN
    assigned_role := 'superadmin';
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, role, status, plan, security_pin, created_at)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    assigned_role,
    'active',
    CASE WHEN assigned_role = 'superadmin' THEN 'business' ELSE 'free' END,
    '2026',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    status = EXCLUDED.status;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
