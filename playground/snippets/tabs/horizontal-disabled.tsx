import { Tabs } from "@/components/tabs/Tabs";

export default function TabsHorizontalDisabledSnippet() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">
          <Tabs.Label>Overview</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="analytics">
          <Tabs.Label>Analytics</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="reports" disabled>
          <Tabs.Label>Reports</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <p>Overview panel content.</p>
      </Tabs.Panel>
      <Tabs.Panel value="analytics">
        <p>Analytics panel content.</p>
      </Tabs.Panel>
      <Tabs.Panel value="reports">
        <p>Reports panel content (disabled tab).</p>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
