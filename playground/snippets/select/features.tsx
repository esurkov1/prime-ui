import { Select } from "@/components/select/Select";

const ZONES = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"] as const;

export default function SelectFeaturesSnippet() {
  return (
    <Select.Root size="m" placeholder="Зона и группы">
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.GroupLabel>Доступно сейчас</Select.GroupLabel>
          <Select.Item value="east-1">Восток — узел 1</Select.Item>
          <Select.Item value="east-2">Восток — узел 2</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.GroupLabel>Планируется</Select.GroupLabel>
          <Select.Item value="west-1" disabled>
            Запад — узел 1 (зарезервировано)
          </Select.Item>
          {ZONES.map((z, i) => (
            <Select.Item key={z} value={`zone-${i}`}>
              Резерв {z}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
