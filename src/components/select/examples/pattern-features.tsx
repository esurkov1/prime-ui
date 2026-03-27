import { Select } from "@/components/select/Select";

const ZONES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"] as const;

/** Groups, labels, separator, disabled item, long scrollable list; mirrors `playground/snippets/select/features.tsx`. */
export default function SelectPatternFeaturesExample() {
  return (
    <Select.Root placeholder="Zones and groups">
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.GroupLabel>Available now</Select.GroupLabel>
          <Select.Item value="east-1">East — node 1</Select.Item>
          <Select.Item value="east-2">East — node 2</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.GroupLabel>Planned</Select.GroupLabel>
          <Select.Item value="west-1" disabled>
            West — node 1 (reserved)
          </Select.Item>
          {ZONES.map((z, i) => (
            <Select.Item key={z} value={`zone-${i}`}>
              Reserve {z}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
