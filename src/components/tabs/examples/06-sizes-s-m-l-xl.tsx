import { Icon, Tabs, type TabsSize, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: readonly TabsSize[] = ["s", "m", "l", "xl"];

function TabsSizeGroup({ size }: { size: TabsSize }) {
  return (
    <div className={styles.sizesGroup}>
      <p className={styles.sizesLabel}>{`size="${size}"`}</p>
      <Tabs.Root defaultValue="a" size={size}>
        <Tabs.List>
          <Tabs.Tab value="a">
            <Tabs.Icon>
              <Icon name="nav.layoutGrid" tone="subtle" />
            </Tabs.Icon>
            <Tabs.Label>Alpha</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="b">
            <Tabs.Label>Beta</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="c">
            <Tabs.Label>Gamma</Tabs.Label>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Panel A — same structure at each size; only the control token tier changes.
          </Typography.Root>
        </Tabs.Panel>
        <Tabs.Panel value="b">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Panel B.
          </Typography.Root>
        </Tabs.Panel>
        <Tabs.Panel value="c">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Panel C.
          </Typography.Root>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}

/**
 * Four `size` rungs (`s`–`xl`): one tab row per size; first tab uses `Tabs.Icon` + `Tabs.Label`,
 * the rest labels only (matches `playground/snippets/tabs/sizes.tsx`).
 */
export default function TabsExampleSizesLadder() {
  return (
    <div className={styles.sizesRow}>
      {sizes.map((s) => (
        <TabsSizeGroup key={s} size={s} />
      ))}
    </div>
  );
}
