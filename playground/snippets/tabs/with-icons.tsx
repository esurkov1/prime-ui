import { Tabs } from "@/components/tabs/Tabs";
import { Icon } from "@/icons";

/**
 * Несколько слотов `Tabs.Icon` в одном триггере (слева, справа от подписи) и двойная иконка.
 * `Tabs.Label` даёт переносимый кегль и сжатие длинного текста в ряду.
 */
export default function TabsWithIconsSnippet() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">
          <Tabs.Icon>
            <Icon name="nav.layoutGrid" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Label>Overview</Tabs.Label>
          <Tabs.Icon>
            <Icon name="nav.chevronRight" tone="subtle" />
          </Tabs.Icon>
        </Tabs.Tab>
        <Tabs.Tab value="dashboard">
          <Tabs.Icon>
            <Icon name="nav.layoutGrid" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Label>Dashboard</Tabs.Label>
          <Tabs.Icon>
            <Icon name="nav.chevronRight" tone="subtle" />
          </Tabs.Icon>
        </Tabs.Tab>
        <Tabs.Tab value="settings">
          <Tabs.Icon>
            <Icon name="nav.layoutGrid" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Icon>
            <Icon name="field.email" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Label>Settings</Tabs.Label>
          <Tabs.Icon>
            <Icon name="nav.chevronRight" tone="subtle" />
          </Tabs.Icon>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Контент Overview</Tabs.Panel>
      <Tabs.Panel value="dashboard">Контент Dashboard</Tabs.Panel>
      <Tabs.Panel value="settings">Контент Settings</Tabs.Panel>
    </Tabs.Root>
  );
}
