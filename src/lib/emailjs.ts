import emailjs from "@emailjs/browser"

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

interface AlertParams {
  user_name: string
  payment_name: string
  due_date: string
  to_email: string
}

export async function sendDueAlert(params: AlertParams) {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        user_name: params.user_name,
        payment_name: params.payment_name,
        due_date: params.due_date,
        to_email: params.to_email,
      },
      PUBLIC_KEY
    )
    return { success: true, result }
  } catch (error) {
    console.error("Error sending email alert:", error)
    return { success: false, error }
  }
}
