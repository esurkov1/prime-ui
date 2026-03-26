import { Tabs, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Controlled mode: drive `value` / `onValueChange` from routing, query params, or store so the
 * active tab matches shareable URL state.
 */
export default function TabsExampleControlledActiveTab() {
  const [active, setActive] = React.useState("details");

  return (
    <>
      <Tabs.Root value={active} onValueChange={setActive}>
        <Tabs.List>
          <Tabs.Tab value="details">
            <Tabs.Label>Details</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="shipping">
            <Tabs.Label>Shipping</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="history">
            <Tabs.Label>History</Tabs.Label>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="details">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            SKU, price, and merchandising copy for this line item.
          </Typography.Root>
        </Tabs.Panel>
        <Tabs.Panel value="shipping">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Carrier, service level, and estimated delivery window.
          </Typography.Root>
        </Tabs.Panel>
        <Tabs.Panel value="history">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Status changes and notes from fulfillment.
          </Typography.Root>
        </Tabs.Panel>
      </Tabs.Root>
      <p className={styles.controlledCaption}>
        Active tab id (for example sync with <code>?tab=</code>): <strong>{active}</strong>
      </p>
    </>
  );
}
