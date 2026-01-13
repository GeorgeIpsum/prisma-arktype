import { type } from "arktype";

export const TestUserOrderBy = type({
  "id?": "'asc' | 'desc'",
  "email?": "'asc' | 'desc'",
  "name?": "'asc' | 'desc'",
  "phoneNumber?": "'asc' | 'desc'",
  "isActive?": "'asc' | 'desc'",
  "createdAt?": "'asc' | 'desc'",
  "updatedAt?": "'asc' | 'desc'",
});
