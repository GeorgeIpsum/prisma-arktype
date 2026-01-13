import { type } from "arktype";
import { TestCurrency } from "./TestCurrency";
import { TestStatus } from "./TestStatus";
export const TestEnumModelUpdate = type({
  "currency?": TestCurrency,
  "status?": TestStatus,
  "optionalCurrency?": TestCurrency.or("null"),
  "optionalStatus?": TestStatus.or("null"),
});
