/** Specs of a plan on one line each: an icon picker and a color swatch take compact columns, the first three specs are pinned with a lock and the rest reorder below them — `getLocked`, `width`, `reorderable`. */
import {
  ColorPresets,
  FieldList,
  type FieldListColumn,
  Icon,
  type IconName,
  Input,
  Select,
} from "prime-ui-kit";
import * as React from "react";

type Spec = {
  id: string;
  icon: IconName;
  name: string;
  value: string;
  color: string;
  pinned?: boolean;
};

const COLUMNS: FieldListColumn[] = [
  { label: "Иконка", width: "compact" },
  { label: "Параметр" },
  { label: "Значение" },
  { label: "Цвет", width: "compact" },
];

const ICONS: { name: IconName; label: string }[] = [
  { name: "object.users", label: "Пользователи" },
  { name: "object.storage", label: "Хранилище" },
  { name: "object.headset", label: "Поддержка" },
  { name: "object.chart", label: "Отчёты" },
  { name: "object.key", label: "Доступ" },
  { name: "object.globe", label: "Интеграции" },
];

const SPECS: Spec[] = [
  {
    id: "seats",
    icon: "object.users",
    name: "Сотрудники",
    value: "до 50",
    color: "#5068f5",
    pinned: true,
  },
  {
    id: "storage",
    icon: "object.storage",
    name: "Хранилище",
    value: "200 ГБ",
    color: "#22c55e",
    pinned: true,
  },
  {
    id: "support",
    icon: "object.headset",
    name: "Поддержка",
    value: "8/5",
    color: "#f97316",
    pinned: true,
  },
  { id: "reports", icon: "object.chart", name: "Отчёты", value: "12 шаблонов", color: "#a855f7" },
  { id: "sso", icon: "object.key", name: "Вход через SSO", value: "SAML, OIDC", color: "#14b8a6" },
];

export default function FieldListLockedExample() {
  const [specs, setSpecs] = React.useState(SPECS);

  return (
    <FieldList
      label="Характеристики тарифа"
      columns={COLUMNS}
      reorderable
      value={specs}
      onValueChange={setSpecs}
      getId={(spec) => spec.id}
      getLabel={(spec) => spec.name}
      getLocked={(spec) => spec.pinned ?? false}
      createItem={(): Spec => ({
        id: crypto.randomUUID(),
        icon: "object.globe",
        name: "",
        value: "",
        color: "#14b8a6",
      })}
      addLabel="Добавить характеристику"
      renderItem={(spec, row) => (
        <>
          <Select.Root
            value={spec.icon}
            onValueChange={(icon) => row.update({ icon: icon as IconName })}
          >
            <Select.Trigger>
              <Select.TriggerIcon>
                <Icon name={spec.icon} />
              </Select.TriggerIcon>
            </Select.Trigger>
            <Select.Content>
              {ICONS.map((icon) => (
                <Select.Item key={icon.name} value={icon.name}>
                  <Select.ItemIcon>
                    <Icon name={icon.name} />
                  </Select.ItemIcon>
                  {icon.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={spec.name}
                onChange={(event) => row.update({ name: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={spec.value}
                onChange={(event) => row.update({ value: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
          <ColorPresets.Root
            value={spec.color}
            onValueChange={(color) => row.update({ color: color ?? spec.color })}
          >
            <ColorPresets.Trigger>
              <ColorPresets.SwatchButton />
            </ColorPresets.Trigger>
            <ColorPresets.Content />
          </ColorPresets.Root>
        </>
      )}
    />
  );
}
