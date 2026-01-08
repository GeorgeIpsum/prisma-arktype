export type Annotation =
  | { type: "HIDDEN" }
  | { type: "HIDDEN_INPUT" }
  | { type: "HIDDEN_INPUT_CREATE" }
  | { type: "HIDDEN_INPUT_UPDATE" }
  | { type: "TYPE_OVERWRITE"; value: string };

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
];

const prismaArktypeTypeOverwriteRegex = /@prisma-arktype\.typeOverwrite=(.+)/;

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
            isAnnotation = true;

            if (type === "TYPE_OVERWRITE") {
              const match = line.match(prismaArktypeTypeOverwriteRegex);
              if (match && match[1]) {
                annotations.push({
                  type: "TYPE_OVERWRITE",
                  value: match[1].trim(),
                });
              } else {
                throw new Error(`Invalid TYPE_OVERWRITE annotation: ${line}`);
              }
            } else {
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
