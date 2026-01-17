import { type } from "arktype";

export const AddressSchema = type({
  street: "string",
  city: "string",
  zipCode: "string",
  country: "string",
});

export const ItemSchema = type({
  id: "string",
  quantity: "number.integer",
});

export const MetadataSchema = type({
  key: "string",
  value: "string",
});
