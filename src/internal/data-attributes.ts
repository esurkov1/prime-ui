type DataPrimitive = string | number | boolean | undefined;

type DataAttributesInput = Record<string, DataPrimitive>;
type DataAttributesOutput = Record<string, string | undefined>;

export function toDataAttributes(input: DataAttributesInput): DataAttributesOutput {
  const result: DataAttributesOutput = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) {
      continue;
    }

    const attributeName = `data-${key}`;
    result[attributeName] = typeof value === "boolean" ? String(value) : `${value}`;
  }

  return result;
}
