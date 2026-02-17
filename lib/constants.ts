import type { ExchangeRate, FiatCurrency } from "@/lib/types/payment.types";

export const GENRES = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Thriller",
  "Horror",
  "Adventure",
  "Historical Fiction",
  "Comedy",
  "Drama",
  "Superhero",
  "Dystopian",
  "Musical",
  "Western",
  "Biographical",
  "Cyberpunk",
] as const;

export const LANGUAGES = [
  { value: "en", label: "English" },
  // { value: "es", label: "Spanish" },
  // { value: "fr", label: "French" },
] as const;

export const CONTENT_RATINGS = [
  { value: "all-ages", label: "All Ages" },
  { value: "teens-13+", label: "Teens - Age 13+" },
  { value: "mature-17+", label: "Mature - Age 17+" },
  { value: "adults-18+", label: "Adults - Age 18+" },
] as const;

// ===== Payment Constants =====

export const EXCHANGE_RATES: Record<FiatCurrency, ExchangeRate> = {
  USD: {
    currency: "USD",
    ratePerNWT: 0.1,
    symbol: "$",
    smallestUnitName: "cents",
    smallestUnitMultiplier: 100,
  },
  NGN: {
    currency: "NGN",
    ratePerNWT: 150,
    symbol: "\u20A6",
    smallestUnitName: "kobo",
    smallestUnitMultiplier: 100,
  },
} as const;

export const TRANSACTION_FEE_RATE = 0.01;

export const NWT_SUGGESTED_AMOUNTS = [10, 30, 50, 100] as const;
