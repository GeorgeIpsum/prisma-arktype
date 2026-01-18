import { type } from "arktype";

/**
 * @description Buffer instance type
 */
export const BufferInstance = type("unknown").narrow(
  (value, ctx): value is Buffer => {
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
      return true;
    } else if (typeof Buffer === "undefined") {
      ctx.errors.add(ctx.error("Buffer is not defined in this environment"));
    }
    return ctx.mustBe("an instance of Buffer");
  },
);
