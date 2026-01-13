import { type } from "arktype";

export const TestEnumModelOrderBy = type({
  "id?": "'asc' | 'desc'",
  "currency?": "'asc' | 'desc'",
  "status?": "'asc' | 'desc'",
  "optionalCurrency?": "'asc' | 'desc'",
  "optionalStatus?": "'asc' | 'desc'",
});
