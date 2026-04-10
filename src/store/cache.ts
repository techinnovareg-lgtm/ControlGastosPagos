import { create } from 'zustand'

interface CacheState {
  // Accounts
  accounts: any[];
  accountsLoaded: boolean;
  setAccounts: (data: any[]) => void;
  invalidateAccounts: () => void;

  // Payments
  payments: any[];
  paymentsLoaded: boolean;
  setPayments: (data: any[]) => void;
  invalidatePayments: () => void;

  // Incomes
  incomes: any[];
  incomesLoaded: boolean;
  setIncomes: (data: any[]) => void;
  invalidateIncomes: () => void;

  // Categories
  categories: any[];
  categoriesLoaded: boolean;
  setCategories: (data: any[]) => void;
  invalidateCategories: () => void;

  // Savings
  savingsGoals: any[];
  savingsLoaded: boolean;
  setSavings: (data: any[]) => void;
  invalidateSavings: () => void;
  
  // Contributions
  contributions: Record<string, any[]>;
  contributionsLoaded: Record<string, boolean>;
  setContributions: (goalId: string, data: any[]) => void;

  // Debts
  debts: any[];
  debtsLoaded: boolean;
  setDebts: (data: any[]) => void;
  invalidateDebts: () => void;
}

export const useCacheStore = create<CacheState>((set) => ({
  accounts: [],
  accountsLoaded: false,
  setAccounts: (data) => set({ accounts: data, accountsLoaded: true }),
  invalidateAccounts: () => set({ accountsLoaded: false }),

  payments: [],
  paymentsLoaded: false,
  setPayments: (data) => set({ payments: data, paymentsLoaded: true }),
  invalidatePayments: () => set({ paymentsLoaded: false }),

  incomes: [],
  incomesLoaded: false,
  setIncomes: (data) => set({ incomes: data, incomesLoaded: true }),
  invalidateIncomes: () => set({ incomesLoaded: false }),

  categories: [],
  categoriesLoaded: false,
  setCategories: (data) => set({ categories: data, categoriesLoaded: true }),
  invalidateCategories: () => set({ categoriesLoaded: false }),

  savingsGoals: [],
  savingsLoaded: false,
  setSavings: (data) => set({ savingsGoals: data, savingsLoaded: true }),
  invalidateSavings: () => set({ savingsLoaded: false }),

  contributions: {},
  contributionsLoaded: {},
  setContributions: (goalId, data) => set((state) => ({ 
    contributions: { ...state.contributions, [goalId]: data },
    contributionsLoaded: { ...state.contributionsLoaded, [goalId]: true }
  })),

  debts: [],
  debtsLoaded: false,
  setDebts: (data) => set({ debts: data, debtsLoaded: true }),
  invalidateDebts: () => set({ debtsLoaded: false }),
}))
