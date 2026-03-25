import { Tabs, type TabsSize } from "@/components/tabs/Tabs";
import { Icon } from "@/icons";

import styles from "./sizes.module.css";

const sizes: readonly TabsSize[] = ["s", "m", "l", "xl"];

function TabsSizeGroup({ size }: { size: TabsSize }) {
  return (
    <div className={styles.group}>
      <p className={styles.label}>{`size="${size}"`}</p>
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
        <Tabs.Panel value="a">Панель A</Tabs.Panel>
        <Tabs.Panel value="b">Панель B</Tabs.Panel>
        <Tabs.Panel value="c">Панель C</Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}

/** Четыре размера — по одной группе на строку. */
export default function TabsSizesSnippet() {
  return (
    <div className={styles.row}>
      {sizes.map((s) => (
        <TabsSizeGroup key={s} size={s} />
      ))}
    </div>
  );
}
