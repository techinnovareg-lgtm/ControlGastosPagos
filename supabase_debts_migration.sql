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
