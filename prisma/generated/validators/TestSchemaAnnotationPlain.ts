import { type } from "arktype";
import defaultSchema_configJson from "../../../__tests__/fixtures/defaultSchema";
import {
  AddressSchema as AddressSchema_addressJson,
  ItemSchema as ItemSchema_items,
  MetadataSchema as MetadataSchema_metadata,
} from "../../../__tests__/fixtures/schemas";
export const TestSchemaAnnotationPlain = type({
  "id?": "string",
  inlineJson: { name: "string", age: "number.integer" },
  addressJson: AddressSchema_addressJson,
  configJson: defaultSchema_configJson,
  emailWithSchema: "string.email",
  items: ItemSchema_items.array(),
  "metadata?": MetadataSchema_metadata.or("null"),
});
