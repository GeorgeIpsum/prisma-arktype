import { type } from "arktype";
import { TestCurrency } from "./TestCurrency";
import { TestStatus } from "./TestStatus";
export const TestEnumModelPlain = type({
  "id?": "string",
  "currency?": TestCurrency,
  "status?": TestStatus,
  "optionalCurrency?": TestCurrency.or("null"),
  "optionalStatus?": TestStatus.or("null"),
});
