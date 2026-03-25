import * as React from "react";
import { Tabs } from "@/components/tabs/Tabs";

export default function TabsControlledSnippet() {
  const [controlled, setControlled] = React.useState("account");

  return (
    <>
      <Tabs.Root value={controlled} onValueChange={setControlled}>
        <Tabs.List>
          <Tabs.Tab value="account">
            <Tabs.Label>Account</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="notifications">
            <Tabs.Label>Notifications</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="integrations">
            <Tabs.Label>Integrations</Tabs.Label>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="account">
          <p>Account panel content (controlled).</p>
        </Tabs.Panel>
        <Tabs.Panel value="notifications">
          <p>Notifications panel content (controlled).</p>
        </Tabs.Panel>
        <Tabs.Panel value="integrations">
          <p>Integrations panel content (controlled).</p>
        </Tabs.Panel>
      </Tabs.Root>
      <p className="previewCaption previewCaptionTopBase">
        Active: <strong>{controlled}</strong>
      </p>
    </>
  );
}
