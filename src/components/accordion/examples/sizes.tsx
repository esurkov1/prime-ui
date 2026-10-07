/** Accordion at every size tier xs → xl. Match `size` to the density of the surrounding screen. */
import { Accordion, type ControlSize, Typography } from "prime-ui-kit";
import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function AccordionSizesExample() {
  return (
    <div className={styles.grid}>
      {sizes.map((size) => (
        <div key={size} className={styles.group}>
          <Typography.Root variant="code" tone="muted">
            size="{size}"
          </Typography.Root>
          <Accordion.Root size={size} defaultValue="a">
            <Accordion.Item value="a">
              <Accordion.Header>
                <Accordion.Trigger>
                  <span>Тариф</span>
                  <Accordion.Arrow />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>«Бизнес», продление 12 ноября.</Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="b">
              <Accordion.Header>
                <Accordion.Trigger>
                  <span>Счета</span>
                  <Accordion.Arrow />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>Последний счёт оплачен.</Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      ))}
    </div>
  );
}
