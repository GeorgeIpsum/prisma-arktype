export type Annotation =
  | { type: "HIDDEN" }
  | { type: "HIDDEN_INPUT" }
  | { type: "HIDDEN_INPUT_CREATE" }
  | { type: "HIDDEN_INPUT_UPDATE" }
  | { type: "TYPE_OVERWRITE"; value: string }
  | {
      type: "SCHEMA";
      value: string;
      isExternal: boolean;
      importPath?: string;
      exportName?: string;
    };

export function isHidden(
  annotation: Annotation,
): annotation is { type: "HIDDEN" } {
  return annotation.type === "HIDDEN";
}

export function isHiddenInput(
  annotation: Annotation,
): annotation is { type: "HIDDEN_INPUT" } {
  return annotation.type === "HIDDEN_INPUT";
}

export function isHiddenInputCreate(
  annotation: Annotation,
): annotation is { type: "HIDDEN_INPUT_CREATE" } {
  return annotation.type === "HIDDEN_INPUT_CREATE";
}

export function isHiddenInputUpdate(
  annotation: Annotation,
): annotation is { type: "HIDDEN_INPUT_UPDATE" } {
  return annotation.type === "HIDDEN_INPUT_UPDATE";
}

export function isTypeOverwrite(
  annotation: Annotation,
): annotation is { type: "TYPE_OVERWRITE"; value: string } {
  return annotation.type === "TYPE_OVERWRITE";
}

export function isSchema(annotation: Annotation): annotation is {
  type: "SCHEMA";
  value: string;
  isExternal: boolean;
  importPath?: string;
  exportName?: string;
} {
  return annotation.type === "SCHEMA";
}

const annotationKeys = [
  {
    keys: ["@prisma-arktype.hide", "@prisma-arktype.hidden"],
    type: "HIDDEN" as const,
  },
  {
    keys: ["@prisma-arktype.input.hide", "@prisma-arktype.input.hidden"],
    type: "HIDDEN_INPUT" as const,
  },
  {
    keys: [
      "@prisma-arktype.create.input.hide",
      "@prisma-arktype.create.input.hidden",
    ],
    type: "HIDDEN_INPUT_CREATE" as const,
  },
  {
    keys: [
      "@prisma-arktype.update.input.hide",
      "@prisma-arktype.update.input.hidden",
    ],
    type: "HIDDEN_INPUT_UPDATE" as const,
  },
  { keys: ["@prisma-arktype.typeOverwrite"], type: "TYPE_OVERWRITE" as const },
  { keys: ["@prisma-arktype.schema"], type: "SCHEMA" as const },
];

const prismaArktypeTypeOverwriteRegex = /@prisma-arktype\.typeOverwrite=(.+)/;
const prismaArktypeSchemaRegex = /@prisma-arktype\.schema="([^"]+)"/;

export function extractAnnotations(documentation?: string): {
  annotations: Annotation[];
  description: string;
  hidden: boolean;
  hiddenInput: boolean;
  hiddenInputCreate: boolean;
  hiddenInputUpdate: boolean;
} {
  const annotations: Annotation[] = [];
  const descriptionLines: string[] = [];

  if (documentation) {
    for (const line of documentation.split("\n")) {
      let isAnnotation = false;

      for (const { keys, type } of annotationKeys) {
        for (const key of keys) {
          if (line.includes(key)) {
            // For TYPE_OVERWRITE and SCHEMA, check if the pattern actually matches
            if (type === "TYPE_OVERWRITE") {
              const match = line.match(prismaArktypeTypeOverwriteRegex);
              if (match && match[1]) {
                isAnnotation = true;
                annotations.push({
                  type: "TYPE_OVERWRITE",
                  value: match[1].trim(),
                });
              }
              // If no match, it's just a mention in documentation, not an annotation
            } else if (type === "SCHEMA") {
              const match = line.match(prismaArktypeSchemaRegex);
              if (match && match[1]) {
                isAnnotation = true;
                const schemaValue = match[1].trim();

                // External schemas are file paths (contain /) or module:export patterns
                // Inline schemas start with { or are type strings like "string.email"
                const isExternal =
                  schemaValue.includes("/") ||
                  (!(
                    schemaValue.startsWith("{") ||
                    schemaValue.startsWith('"') ||
                    schemaValue.startsWith("'")
                  ) &&
                    schemaValue.includes(":") &&
                    // Ensure it's a module:export pattern, not object syntax like { key: value }
                    !schemaValue.includes(" ") &&
                    !schemaValue.includes(","));

                if (isExternal) {
                  // Parse: "path:ExportName" or "path"
                  const colonIndex = schemaValue.indexOf(":");
                  if (colonIndex > 0) {
                    // Named export
                    const path = schemaValue.substring(0, colonIndex).trim();
                    const exportName = schemaValue
                      .substring(colonIndex + 1)
                      .trim();
                    annotations.push({
                      type: "SCHEMA",
                      value: schemaValue,
                      isExternal: true,
                      importPath: path,
                      exportName: exportName,
                    });
                  } else {
                    // Default export
                    annotations.push({
                      type: "SCHEMA",
                      value: schemaValue,
                      isExternal: true,
                      importPath: schemaValue,
                    });
                  }
                } else {
                  // Inline schema
                  annotations.push({
                    type: "SCHEMA",
                    value: schemaValue,
                    isExternal: false,
                  });
                }
              }
              // If no match, it's just a mention in documentation, not an annotation
            } else {
              // For other annotation types, the presence of the key is enough
              isAnnotation = true;
              annotations.push({ type });
            }
            break;
          }
        }
        if (isAnnotation) break;
      }

      if (!isAnnotation) {
        descriptionLines.push(line);
      }
    }
  }

  return {
    annotations,
    description: descriptionLines.join("\n").trim(),
    hidden: annotations.some(isHidden),
    hiddenInput: annotations.some(isHiddenInput),
    hiddenInputCreate: annotations.some(isHiddenInputCreate),
    hiddenInputUpdate: annotations.some(isHiddenInputUpdate),
  };
}

export function containsHidden(annotations: Annotation[]): boolean {
  return annotations.some(isHidden);
}

export function containsHiddenInput(annotations: Annotation[]): boolean {
  return annotations.some(isHiddenInput);
}

export function containsHiddenInputCreate(annotations: Annotation[]): boolean {
  return annotations.some(isHiddenInputCreate);
}

export function containsHiddenInputUpdate(annotations: Annotation[]): boolean {
  return annotations.some(isHiddenInputUpdate);
}
