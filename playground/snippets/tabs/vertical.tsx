import { Tabs } from "@/components/tabs/Tabs";

export default function TabsVerticalSnippet() {
  return (
    <Tabs.Root defaultValue="profile" orientation="vertical">
      <Tabs.List>
        <Tabs.Tab value="profile">
          <Tabs.Label>Profile</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="security">
          <Tabs.Label>Security</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="billing">
          <Tabs.Label>Billing</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="profile">
        <p>Profile settings panel.</p>
      </Tabs.Panel>
      <Tabs.Panel value="security">
        <p>Security settings panel.</p>
      </Tabs.Panel>
      <Tabs.Panel value="billing">
        <p>Billing settings panel.</p>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
