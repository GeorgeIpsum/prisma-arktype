import { type } from "arktype";

export const TestUserCreate = type({
  email: "string.email",
  "name?": "string | null",
  "phoneNumber?": "string | null",
  "isActive?": "boolean",
});
