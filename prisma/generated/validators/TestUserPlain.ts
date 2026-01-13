import { type } from "arktype";

export const TestUserPlain = type({
  "id?": "string",
  email: "string.email",
  "name?": "string | null",
  "phoneNumber?": "string | null",
  "isActive?": "boolean",
  "createdAt?": "Date",
  updatedAt: "Date",
});
