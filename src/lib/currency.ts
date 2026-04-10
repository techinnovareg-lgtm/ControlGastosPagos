/**
 * Utilidades para formateo y conversión de monedas
 */

export type CurrencyCode = "PEN" | "USD" | "EUR";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  PEN: "S/",
  USD: "$",
  EUR: "€",
};

/**
 * Formatea un monto (que siempre está en PEN en la BD)
 * hacia la moneda seleccionada basándose en el tipo de cambio.
 */
export function formatCurrency(
  baseAmount: number,
  targetCurrency: CurrencyCode,
  exchangeRates: Record<string, number>
): string {
  if (isNaN(baseAmount)) return `${CURRENCY_SYMBOLS[targetCurrency]} 0.00`;

  let convertedAmount = baseAmount;
  
  if (targetCurrency !== "PEN") {
    // exchangeRates debería tener al menos USD y EUR basado en 1 PEN.
    // Si la API devuelve rates basados en USD, habrá que ajustar.
    // Asumiremos que la API da rates basados en PEN (ej. PEN -> USD = ~0.26)
    const rate = exchangeRates[targetCurrency] || 1;
    convertedAmount = baseAmount * rate;
  }

  const symbol = CURRENCY_SYMBOLS[targetCurrency];
  
  // Para montos negativos, poner el símbolo antes del número pero después del menos
  const isNegative = convertedAmount < 0;
  const absAmount = Math.abs(convertedAmount).toFixed(2);
  
  return isNegative ? `-${symbol} ${absAmount}` : `${symbol} ${absAmount}`;
}

/**
 * Convierte un input del usuario (en su moneda seleccionada) a PEN para guardar.
 */
export function inputToBase(
  inputAmount: number,
  currentCurrency: CurrencyCode,
  exchangeRates: Record<string, number>
): number {
  if (currentCurrency === "PEN") return inputAmount;
  
  const rate = exchangeRates[currentCurrency] || 1;
  // Si convertir PEN -> USD se hizo multiplicando (rate < 1), 
  // revertirlo es dividiendo.
  return inputAmount / rate;
}
