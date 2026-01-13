import { type } from "arktype";

export const TestUserWhere = type({
  "id?": "string",
  "email?": "string.email",
  "name?": "string",
  "phoneNumber?": "string",
  "isActive?": "boolean",
  "createdAt?": "Date",
  "updatedAt?": "Date",
});
