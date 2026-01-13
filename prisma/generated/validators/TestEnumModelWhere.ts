import { type } from "arktype";
import { TestCurrency } from "./TestCurrency";
import { TestStatus } from "./TestStatus";
export const TestEnumModelWhere = type({
  "id?": "string",
  "currency?": TestCurrency,
  "status?": TestStatus,
  "optionalCurrency?": TestCurrency,
  "optionalStatus?": TestStatus,
});
