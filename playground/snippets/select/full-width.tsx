import { Select } from "@/components/select/Select";

export default function SelectFullWidthSnippet() {
  return (
    <div style={{ width: "100%", maxWidth: "20rem" }}>
      <Select.Root size="m" defaultValue="ship" placeholder="Способ доставки">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="pickup">Самовывоз</Select.Item>
          <Select.Item value="ship">Курьер</Select.Item>
          <Select.Item value="post">Почта</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
