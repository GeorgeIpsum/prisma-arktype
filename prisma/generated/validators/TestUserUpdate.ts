import { type } from "arktype";

export const TestUserUpdate = type({
  "email?": "string.email",
  "name?": "string | null",
  "phoneNumber?": "string | null",
  "isActive?": "boolean",
});
