-- ==============================================================
-- MIGRACIÓN: ROLES DE USUARIO, SUPERADMIN Y PIN DE SEGURIDAD (NOVAKEY)
-- ControlTotal SaaS by Tech Innova
-- ==============================================================

-- 1. Agregar columnas a profiles si no existen
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS security_pin TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Asegurar que las cuentas superadmin tengan el rol correcto
UPDATE public.profiles
SET role = 'superadmin', plan = 'business', status = 'active'
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('tech.innova.reg@gmail.com', 'carlos.amambal@gmail.com')
);

-- 3. Actualizar función trigger para nuevos registros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT := 'user';
BEGIN
  -- Asignar superadmin si es el correo principal corporativo
  IF new.email IN ('tech.innova.reg@gmail.com', 'carlos.amambal@gmail.com') THEN
    assigned_role := 'superadmin';
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, role, status, plan, created_at)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    assigned_role,
    'active',
    CASE WHEN assigned_role = 'superadmin' THEN 'business' ELSE 'free' END,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    status = EXCLUDED.status;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Política RLS: Los superadmins y admins pueden consultar y actualizar todos los profiles
CREATE POLICY "Admins can view and manage all profiles"
  ON public.profiles
  FOR ALL
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );
