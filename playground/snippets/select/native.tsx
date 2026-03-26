import { Select } from "@/components/select/Select";

export default function SelectNativeSnippet() {
  return (
    <Select.Root native size="m" placeholder="Режим">
      <Select.Content>
        <Select.Item value="auto">Авто</Select.Item>
        <Select.Item value="light">Светлая тема</Select.Item>
        <Select.Item value="dark">Тёмная тема</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
