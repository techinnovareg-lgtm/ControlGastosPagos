import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseISO, startOfDay, addDays, isSameDay, isPast } from "date-fns";
import { formatNotificationHtml } from "@/lib/email";

// Validar que nadie pueda gatillar esto masivamente sin un secret (opcional pero recomendado)
// En Vercel puedes validar vercel.cron.secret o un token. Por ahora dejaremos la ruta abierta / en desarrollo.
export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Falta SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
  }

  // Admin DB
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // 1. Obtener todos los usuarios de Auth
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  if (authError || !users) {
    return NextResponse.json({ error: authError }, { status: 500 });
  }

  // 2. Obtener pagos y deudas
  const { data: payments } = await supabase.from('payments').select('*').eq('status', 'pendiente');
  const { data: debts } = await supabase.from('debts').select('*').gt('remaining_amount', 0);

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  let emailsSent = 0;

  for (const user of users) {
    if (!user.email) continue;
    
    // Filtrar recursos por usuario
    const userPayments = payments?.filter(p => p.user_id === user.id) || [];
    const userDebts = debts?.filter(d => d.user_id === user.id) || [];
    
    const alerts: any[] = [];
    
    // Pagos Críticos
    userPayments.forEach(p => {
      const dueDate = startOfDay(parseISO(p.due_date));
      if (isSameDay(dueDate, today)) {
        alerts.push({ title: `Vence Hoy: ${p.name}`, body: `Recuerda pagar ${p.amount} el día de hoy.`, type: 'payment', critical: true });
      } else if (isSameDay(dueDate, tomorrow)) {
        alerts.push({ title: `Vence Mañana: ${p.name}`, body: `El pago de ${p.amount} está próximo a vencer.`, type: 'payment', critical: true });
      } else if (isPast(dueDate) && !isSameDay(dueDate, today)) {
        alerts.push({ title: `Pago Vencido: ${p.name}`, body: `Tienes un pago pendiente de ${p.amount} desde el ${p.due_date}.`, type: 'payment', critical: true });
      }
    });

    // Deudas Iniciales
    userDebts.forEach(d => {
      const debtDate = startOfDay(parseISO(d.start_date));
      if (isSameDay(debtDate, today)) {
        alerts.push({ title: `Nueva Deuda: ${d.debtor_name}`, body: `Hoy inicia la deuda por ${d.concept} de ${d.total_amount}.`, type: 'debt', critical: true });
      }
    });

    if (alerts.length > 0) {
      // Disparar Email vía API REST de EmailJS 
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      const htmlBody = formatNotificationHtml(alerts);
      
      const payload = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          to_email: user.email,
          subject: `⚠️ Alerta Crítica: ${alerts.length} avisos pendientes`,
          message_html: htmlBody
        }
      };

      try {
        const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (emailRes.ok) emailsSent++;
      } catch (e) {
        console.error("Error dispatching emailjs to", user.email, e);
      }
    }
  }

  return NextResponse.json({ success: true, alerts_processed: emailsSent });
}
