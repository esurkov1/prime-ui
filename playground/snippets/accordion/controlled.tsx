import * as React from "react";
import { Accordion } from "@/components/accordion/Accordion";

import styles from "./accordion-demos.module.css";

export default function AccordionControlledSnippet() {
  const [open, setOpen] = React.useState<string>("");

  return (
    <div className="stack">
      <p className="previewCaption">
        Состояние в родителе: <code>value</code> и <code>onValueChange</code> для{" "}
        <code>type=&quot;single&quot;</code>.
      </p>
      <div className="previewRowWrap rowAlignCenter">
        <button type="button" onClick={() => setOpen("")}>
          Свернуть всё
        </button>
        <button type="button" onClick={() => setOpen("orders")}>
          Открыть «Заказы»
        </button>
        <button type="button" onClick={() => setOpen("returns")}>
          Открыть «Возвраты»
        </button>
        <span className={styles.controlledMeta}>
          Сейчас: <strong>{open ? open : "ничего"}</strong>
        </span>
      </div>
      <Accordion.Root
        type="single"
        size="m"
        value={open}
        onValueChange={(next) => {
          if (typeof next === "string") setOpen(next);
        }}
        className="accordionDemo"
      >
        <Accordion.Item value="orders">
          <Accordion.Header>
            <Accordion.Trigger>
              Заказы
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Список и статусы отгрузок.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="returns">
          <Accordion.Header>
            <Accordion.Trigger>
              Возвраты
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Заявки и сроки рассмотрения.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="wallet">
          <Accordion.Header>
            <Accordion.Trigger>
              Баланс
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>История начислений и списаний.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
