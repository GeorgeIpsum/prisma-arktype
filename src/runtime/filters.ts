import { type } from "arktype";

/**
 * DateTimeFilter allows querying DateTime fields with comparison operators.
 * Can be used instead of a direct Date value in where clauses.
 */
export const DateTimeFilter = type({
  "equals?": "Date",
  "in?": "Date[]",
  "notIn?": "Date[]",
  "lt?": "Date",
  "lte?": "Date",
  "gt?": "Date",
  "gte?": "Date",
  "not?": "Date",
});

export type DateTimeFilter = typeof DateTimeFilter.infer;
