import { type } from "arktype";

export const TestUniqueModelCreate = type({
  email: "string",
  username: "string",
  slug: "string",
  category: "string",
});
