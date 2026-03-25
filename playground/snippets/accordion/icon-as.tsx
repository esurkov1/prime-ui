import { Package } from "lucide-react";
import { Accordion } from "@/components/accordion/Accordion";

export default function AccordionIconAsSnippet() {
  return (
    <Accordion.Root type="single" size="m" className="accordionDemo" defaultValue="sku">
      <Accordion.Item value="sku">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as="span" aria-hidden>
              <Package strokeWidth={1.75} style={{ width: "100%", height: "100%" }} />
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
              <Package strokeWidth={1.75} style={{ width: "100%", height: "100%" }} />
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
