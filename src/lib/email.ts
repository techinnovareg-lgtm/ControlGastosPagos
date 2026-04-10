import emailjs from '@emailjs/browser';

export type EmailParams = {
  to_email: string;
  subject: string;
  message_html: string;
};

export const sendNotificationEmail = async (params: EmailParams) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.error("Faltan credenciales de EmailJS en .env.local");
    return { status: 400, text: "Faltan credenciales" };
  }

  try {
    const result = await emailjs.send(
      serviceId,
      templateId,
      params,
      publicKey
    );
    return result;
  } catch (error) {
    console.error("Error enviando email:", error);
    throw error;
  }
};

import { LOGO_PNG_DATA } from "./logo-svg";

export const formatNotificationHtml = (alerts: { title: string; body: string; type: string }[]) => {
  const itemsHtml = alerts.map(alert => `
    <div style="margin-bottom: 20px; padding: 15px; border-radius: 8px; background-color: #f9fafb; border-left: 4px solid ${alert.type === 'payment' ? '#6366f1' : '#f59e0b'};">
      <h3 style="margin: 0 0 5px 0; color: #111827; font-size: 16px;">${alert.title}</h3>
      <p style="margin: 0; color: #4b5563; font-size: 14px;">${alert.body}</p>
    </div>
  `).join('');

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #374151; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="${LOGO_PNG_DATA}" alt="Control Total Logo" style="width: 100px; height: 100px; margin-bottom: 20px;" />
        <h2 style="color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; margin-top: 0;">Resumen de Alertas - Control Total</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.5;">Hola, tienes las siguientes alertas pendientes en tu plataforma:</p>
      ${itemsHtml}
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
        <p>Este es un mensaje automático de tu sistema de gestión financiera.</p>
        <p>Desarrollado por <a href="https://tech-innova.vercel.app/" style="color: #4f46e5; text-decoration: none; font-weight: bold;">Tech Innova</a></p>
      </div>
    </div>
  `;
};
