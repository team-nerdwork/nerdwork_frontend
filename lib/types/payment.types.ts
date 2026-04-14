// ===== Currency & Provider Types =====

export type FiatCurrency = "NGN" | "USD";

export type PaymentProvider = "paystack" | "helio" | "stripe";

export interface ExchangeRate {
  currency: FiatCurrency;
  ratePerNWT: number;
  symbol: string;
  smallestUnitName: string;
  smallestUnitMultiplier: number;
}

// ===== Paystack Popup Callback =====

export interface PaystackCallbackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
}
