import { type } from "arktype";

/**
 * @description Uint8Array instance type for Prisma v7+
 * In Prisma v7+, Bytes fields return as Uint8Array instead of Buffer
 */
export const Uint8ArrayInstance = type("unknown").narrow(
  (value, ctx): value is Uint8Array => {
    if (value instanceof Uint8Array) {
      return true;
    }
    return ctx.mustBe("an instance of Uint8Array");
  },
);
