import * as React from "react";
import { Accordion } from "@/components/accordion/Accordion";

export default function AccordionControlledSnippet() {
  const [open, setOpen] = React.useState<string>("");

  return (
    <div className="stack">
      <p className="previewCaption" style={{ margin: 0 }}>
        Состояние в родителе: <code>value</code> и <code>onValueChange</code> для{" "}
        <code>type=&quot;single&quot;</code>.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--prime-sys-spacing-m)",
          alignItems: "center",
        }}
      >
        <button type="button" onClick={() => setOpen("")}>
          Свернуть всё
        </button>
        <button type="button" onClick={() => setOpen("orders")}>
          Открыть «Заказы»
        </button>
        <button type="button" onClick={() => setOpen("returns")}>
          Открыть «Возвраты»
        </button>
        <span style={{ fontSize: "var(--prime-sys-typography-sizeScale-s)" }}>
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
