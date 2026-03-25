import { Select } from "@/components/select/Select";
import { Icon } from "@/icons";

export default function SelectCompositionSnippet() {
  return (
    <div className="stack" style={{ alignItems: "stretch", maxWidth: "22rem" }}>
      <Select.Root size="m" defaultValue="eur" placeholder="Валюта отчёта">
        <Select.Trigger>
          <Select.TriggerIcon>
            <Icon name="nav.layoutGrid" size="s" tone="subtle" />
          </Select.TriggerIcon>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="rub" label="RUB — Российский рубль">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            ₽ RUB
          </Select.Item>
          <Select.Item value="eur" label="EUR — Евро">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            € EUR
          </Select.Item>
          <Select.Item value="usd" label="USD — Доллар США">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            $ USD
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
