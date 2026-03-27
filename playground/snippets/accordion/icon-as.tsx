import { Package } from "lucide-react";
import { Accordion } from "@/components/accordion/Accordion";

import styles from "./accordion-demos.module.css";

export default function AccordionIconAsSnippet() {
  return (
    <Accordion.Root type="single" className="accordionDemo" defaultValue="sku">
      <Accordion.Item value="sku">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as="span" aria-hidden>
              <Package strokeWidth={1.75} className={styles.iconFill} />
            </Accordion.Icon>
            <span>Состав заказа</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="accordionContentDemo">
          <code>Accordion.Icon</code> с <code>as=&quot;span&quot;</code>: оболочка не фиксирована на{" "}
          <code>div</code>, внутрь кладётся своя разметка (иконка как дочерний элемент).
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="track">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as="span" aria-hidden>
              <Package strokeWidth={1.75} className={styles.iconFill} />
            </Accordion.Icon>
            <span>Отслеживание</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="accordionContentDemo">
          Статусы доставки по трек-номеру.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
