import { Checkbox } from "@/components/checkbox/Checkbox";

export default function CheckboxSizesSnippet() {
  return (
    <>
      <Checkbox.Root size="s">
        <Checkbox.Label>Размер s</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root size="m">
        <Checkbox.Label>Размер m</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root size="l">
        <Checkbox.Label>Размер l</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root size="xl">
        <Checkbox.Label>Размер xl</Checkbox.Label>
      </Checkbox.Root>
    </>
  );
}
