/** Every size tier: trigger height, text, icon and padding grow together — `size`. */
import { Accordion, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function AccordionSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size} className={styles.panel}>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
          <Accordion.Root size={size}>
            <Accordion.Item value="plan">
              <Accordion.Header>
                <Accordion.Trigger>Тариф и продление</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>«Бизнес», продление 12 ноября.</Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      ))}
    </>
  );
}
