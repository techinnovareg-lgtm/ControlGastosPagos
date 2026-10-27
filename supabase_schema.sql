-- 1. Perfiles de usuario (Extensión de Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Cuentas / Tarjetas
CREATE TABLE public.accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Cuenta' | 'Tarjeta'
  initial_balance DECIMAL DEFAULT 0,
  current_balance DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own accounts" ON public.accounts FOR ALL USING (auth.uid() = user_id);

-- 3. Categorías
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users, -- NULL para categorías compartidas
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view default categories and their own" ON public.categories FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can manage their own categories" ON public.categories FOR ALL USING (auth.uid() = user_id);

-- 4. Pagos (Recurrentes y Únicos)
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  account_id UUID REFERENCES public.accounts ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories ON DELETE SET NULL,
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL, -- 'recurrente' | 'unico'
  frequency TEXT, -- 'mensual' | 'anual' | NULL
  due_date DATE NOT NULL,
  payment_method TEXT, -- 'automatico' | 'manual'
  status TEXT DEFAULT 'pendiente', -- 'pendiente' | 'pagado' | 'vencido'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own payments" ON public.payments FOR ALL USING (auth.uid() = user_id);

-- 5. Deudas por Cobrar (Cuentas por Cobrar)
CREATE TABLE public.debts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  debtor_name TEXT NOT NULL,
  concept TEXT NOT NULL,
  total_amount DECIMAL NOT NULL,
  remaining_amount DECIMAL NOT NULL,
  start_date DATE NOT NULL,
  status TEXT DEFAULT 'pendiente', -- 'pendiente' | 'en_progreso' | 'cancelado'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own debts" ON public.debts FOR ALL USING (auth.uid() = user_id);

-- 6. Amortizaciones (Pagos parciales de deudas)
CREATE TABLE public.debt_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  debt_id UUID REFERENCES public.debts ON DELETE CASCADE NOT NULL,
  amount DECIMAL NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.debt_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own debt payments" ON public.debt_payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.debts WHERE id = debt_payments.debt_id AND user_id = auth.uid())
);

-- 7. Notificaciones (Alertas)
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT, -- 'email' | 'push'
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- 8. Trigger para actualizar profiles automáticamente al crear usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. Función para actualizar saldo de deuda al registrar amortización
CREATE OR REPLACE FUNCTION public.update_debt_remaining_amount()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.debts
  SET remaining_amount = total_amount - (SELECT COALESCE(SUM(amount), 0) FROM public.debt_payments WHERE debt_id = NEW.debt_id)
  WHERE id = NEW.debt_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_debt_payment_added
  AFTER INSERT OR UPDATE OR DELETE ON public.debt_payments
  FOR EACH ROW EXECUTE PROCEDURE public.update_debt_remaining_amount();

-- 10. Tabla de Ingresos (Incomes)
CREATE TABLE public.incomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  account_id UUID REFERENCES public.accounts ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories ON DELETE SET NULL,
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL, -- 'unico' | 'recurrente'
  frequency TEXT, -- 'semanal' | 'quincenal' | 'mensual' | 'anual' | NULL
  date DATE NOT NULL,
  status TEXT DEFAULT 'pendiente', -- 'pendiente' | 'recibido'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own incomes" ON public.incomes FOR ALL USING (auth.uid() = user_id);

-- 11. Función para inyectar los ingresos recibidos a la cuenta seleccionada
CREATE OR REPLACE FUNCTION public.update_account_balance_on_income()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'recibido' AND NEW.account_id IS NOT NULL AND (OLD IS NULL OR OLD.status != 'recibido') THEN
    UPDATE public.accounts
    SET current_balance = current_balance + NEW.amount
    WHERE id = NEW.account_id;
  END IF;
  
  -- Reversión si el ingreso cambia de recibido a pendiente o es borrado
  IF (TG_OP = 'DELETE' AND OLD.status = 'recibido' AND OLD.account_id IS NOT NULL) OR 
     (TG_OP = 'UPDATE' AND OLD.status = 'recibido' AND NEW.status != 'recibido' AND OLD.account_id IS NOT NULL) THEN
    UPDATE public.accounts
    SET current_balance = current_balance - OLD.amount
    WHERE id = OLD.account_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_income_status_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.incomes
  FOR EACH ROW EXECUTE PROCEDURE public.update_account_balance_on_income();

-- 12. Metas de Ahorro (Savings Goals)
CREATE TABLE public.savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL NOT NULL,
  current_amount DECIMAL DEFAULT 0,
  target_date DATE,
  status TEXT DEFAULT 'en_progreso', -- 'en_progreso' | 'completada'
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own savings" ON public.savings_goals FOR ALL USING (auth.uid() = user_id);

-- 13. Aportaciones de Ahorro (Saving Contributions)
CREATE TABLE public.saving_contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.savings_goals ON DELETE CASCADE NOT NULL,
  amount DECIMAL NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  account_id UUID REFERENCES public.accounts ON DELETE SET NULL, -- Opcional
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.saving_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own contributions" ON public.saving_contributions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.savings_goals WHERE id = saving_contributions.goal_id AND user_id = auth.uid())
);

-- 14. Funciones para Aportaciones
CREATE OR REPLACE FUNCTION public.handle_saving_contribution()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.savings_goals SET current_amount = current_amount + NEW.amount WHERE id = NEW.goal_id;
    IF NEW.account_id IS NOT NULL THEN
      UPDATE public.accounts SET current_balance = current_balance - NEW.amount WHERE id = NEW.account_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.savings_goals SET current_amount = current_amount - OLD.amount WHERE id = OLD.goal_id;
    IF OLD.account_id IS NOT NULL THEN
      UPDATE public.accounts SET current_balance = current_balance + OLD.amount WHERE id = OLD.account_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_saving_contribution_changed
  AFTER INSERT OR DELETE ON public.saving_contributions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_saving_contribution();


-- 15. Extensión para Superadmin, Roles y PIN de Seguridad (NovaKey Style)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS security_pin TEXT DEFAULT '2026',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role IN ('admin', 'superadmin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Admins can view and manage all profiles" ON public.profiles;

CREATE POLICY "Admins can view and manage all profiles"
  ON public.profiles FOR ALL
  USING (
    auth.uid() = id OR public.check_is_admin()
  );


-- ==============================================================
-- MIGRACIÓN: CORRECCIÓN DE AMORTIZACIONES Y DEUDAS POR COBRAR
-- ControlTotal SaaS by Tech Innova
-- ==============================================================

-- 1. Agregar columna proof_url a debt_payments si no existe
ALTER TABLE public.debt_payments 
  ADD COLUMN IF NOT EXISTS proof_url TEXT;

-- 2. Asegurar que RLS permita a los usuarios insertar, ver, editar y eliminar sus propios pagos
DROP POLICY IF EXISTS "Users can manage their own debt payments" ON public.debt_payments;

CREATE POLICY "Users can manage their own debt payments"
  ON public.debt_payments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.debts 
      WHERE id = debt_payments.debt_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.debts 
      WHERE id = debt_payments.debt_id AND user_id = auth.uid()
    )
  );

-- 3. Función y trigger para recalcular el saldo pendiente y estado de la deuda
-- Maneja INSERT, UPDATE y DELETE (donde NEW es nulo) sin errores.
CREATE OR REPLACE FUNCTION public.update_debt_remaining_amount()
RETURNS TRIGGER AS $$
DECLARE
  target_debt_id UUID;
  current_total NUMERIC;
  paid_total NUMERIC;
  new_remaining NUMERIC;
BEGIN
  -- En caso de DELETE, NEW es NULL, por lo que usamos OLD
  target_debt_id := COALESCE(NEW.debt_id, OLD.debt_id);
  
  -- Obtener monto total original de la deuda
  SELECT COALESCE(total_amount, 0) INTO current_total 
  FROM public.debts 
  WHERE id = target_debt_id;

  -- Obtener suma acumulada de todos los abonos existentes
  SELECT COALESCE(SUM(amount), 0) INTO paid_total 
  FROM public.debt_payments 
  WHERE debt_id = target_debt_id;
  
  -- Calcular saldo pendiente resultante
  new_remaining := GREATEST(0, current_total - paid_total);

  -- Actualizar deuda
  UPDATE public.debts
  SET 
    remaining_amount = new_remaining,
    status = CASE 
      WHEN new_remaining <= 0 THEN 'cancelado'
      WHEN paid_total > 0 THEN 'en_progreso'
      ELSE 'pendiente'
    END
  WHERE id = target_debt_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recrear el trigger con el nuevo procedimiento
DROP TRIGGER IF EXISTS on_debt_payment_added ON public.debt_payments;

CREATE TRIGGER on_debt_payment_added
  AFTER INSERT OR UPDATE OR DELETE ON public.debt_payments
  FOR EACH ROW EXECUTE PROCEDURE public.update_debt_remaining_amount();
