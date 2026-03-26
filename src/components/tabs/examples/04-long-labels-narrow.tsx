import { Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Long tab labels: `Tabs.Label` supports shrinking and ellipsis in cramped horizontal space—keep a
 * narrow `min-width: 0` chain on ancestors so truncation can apply.
 */
export default function TabsExampleLongLabelsNarrow() {
  return (
    <div className={styles.narrowShell}>
      <Tabs.Root defaultValue="short">
        <Tabs.List>
          <Tabs.Tab value="short">
            <Tabs.Label>Summary</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="long">
            <Tabs.Label>Regulatory reporting &amp; compliance documentation workspace</Tabs.Label>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="short">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Short label tab content.
          </Typography.Root>
        </Tabs.Panel>
        <Tabs.Panel value="long">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            The trigger text truncates with an ellipsis when the list is narrower than the full
            string.
          </Typography.Root>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
