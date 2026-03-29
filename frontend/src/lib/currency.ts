// Mock Currency Intelligence Service

export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.3,
  JPY: 151.2,
  CAD: 1.36,
  AUD: 1.52,
};

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string = "USD") => {
  if (fromCurrency === toCurrency) return amount;
  
  const inUSD = amount / (EXCHANGE_RATES[fromCurrency] || 1);
  return inUSD * (EXCHANGE_RATES[toCurrency] || 1);
};

// Simulated AI Anomaly Detection Engine
export const analyzeExpenseForAnomalies = (expense: { amount: number; merchant: string; category: string }) => {
  const anomalies: string[] = [];
  
  // Rule 1: Weekend flagging (Mocked logic, assuming it's weekend context)
  if (expense.category === "Drinks" && expense.amount > 100) {
    anomalies.push("High spend outside core hours (Entertainment flag)");
  }

  // Rule 2: Duplicate amount/merchant check
  // In a real app we'd query the DB here. For the mock, we fake it occasionally
  if (expense.merchant.toLowerCase().includes("uber") && expense.amount === 45.00) {
    anomalies.push("Exact duplicate amount ($45) for this merchant found in last 7 days");
  }

  return anomalies;
};
