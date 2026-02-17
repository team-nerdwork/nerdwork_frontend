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

// ===== Paystack Types =====

export interface PaystackInitializeRequest {
  amount: number; // Amount in smallest unit (kobo for NGN, cents for USD)
  email: string;
  currency: FiatCurrency;
  metadata?: {
    nwtAmount: number;
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string | number;
    }>;
  };
}

export interface PaystackInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackVerifyRequest {
  reference: string;
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    channel: string;
    paid_at: string;
    metadata?: {
      nwtAmount?: number;
    };
  };
}

export interface PaystackCallbackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
}
