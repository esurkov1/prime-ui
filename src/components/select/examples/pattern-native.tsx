import { Select } from "@/components/select/Select";

/** Native `<select>` via `native`; optional `Select.Content` wrapper; mirrors `playground/snippets/select/native.tsx`. */
export default function SelectPatternNativeExample() {
  return (
    <Select.Root native size="m" placeholder="Mode">
      <Select.Content>
        <Select.Item value="auto">Auto</Select.Item>
        <Select.Item value="light">Light</Select.Item>
        <Select.Item value="dark">Dark</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
