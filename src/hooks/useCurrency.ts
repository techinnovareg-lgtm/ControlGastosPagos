import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CurrencyCode } from "@/lib/currency";

interface CurrencyState {
  currency: CurrencyCode;
  rates: Record<string, number>;
  lastFetched: number | null;
  setCurrency: (currency: CurrencyCode) => void;
  fetchRates: () => Promise<void>;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "PEN", // Moneda base
      rates: { PEN: 1 },
      lastFetched: null,

      setCurrency: (newCurrency) => {
        set({ currency: newCurrency });
        get().fetchRates(); // Refrescar si es necesario
      },

      fetchRates: async () => {
        const { lastFetched, rates } = get();
        const now = Date.now();
        // Evitamos llamar a la API si ya la llamamos hace menos de 24 horas
        // y ya tenemos las tasas (USD, EUR)
        if (
          lastFetched &&
          now - lastFetched < 24 * 60 * 60 * 1000 &&
          rates["USD"] &&
          rates["EUR"]
        ) {
          return;
        }

        try {
          const res = await fetch("https://open.er-api.com/v6/latest/PEN");
          if (!res.ok) throw new Error("Fallo al obtener tipos de cambio");
          
          const data = await res.json();
          if (data && data.rates) {
            set({
              rates: {
                PEN: 1,
                USD: data.rates.USD || 0.27, // Fallback en caso de error
                EUR: data.rates.EUR || 0.25,
              },
              lastFetched: now,
            });
          }
        } catch (error) {
          console.error("Error fetching currencies:", error);
          // Si falla y nunca se guardó, usamos valores semilla por defecto
          if (Object.keys(get().rates).length <= 1) {
            set({
              rates: { PEN: 1, USD: 0.267, EUR: 0.255 },
              lastFetched: now,
            });
          }
        }
      },
    }),
    {
      name: "currency-storage", // Clave en localStorage
    }
  )
);
