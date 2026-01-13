import { type } from "arktype";

export const TestCurrency = type(
  "'USD' | 'CAD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CNY'",
);
