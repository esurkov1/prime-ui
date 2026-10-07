/** Every size tier: the filter button, the search, the tags and the panel follow one tier — `size`. */
import { SmartFilter, type SmartFilterField, Typography } from "prime-ui-kit";

const FIELDS: SmartFilterField[] = [
  {
    key: "method",
    label: "Метод",
    options: ["GET", "POST", "PUT", "DELETE"].map((v) => ({ value: v, label: v })),
  },
];

const ONLY_GET = { method: { include: ["GET"], exclude: [] } };
const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SmartFilterSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <SmartFilter.Root fields={FIELDS} size={size} defaultValue={ONLY_GET}>
            <SmartFilter.Toolbar />
            <SmartFilter.Chips />
          </SmartFilter.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
