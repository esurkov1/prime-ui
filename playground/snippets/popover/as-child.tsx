import { Popover } from "@/components/popover/Popover";

import preview from "./preview.module.css";

export default function PopoverAsChildSnippet() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={preview.textLinkTrigger} type="button">
          Подсказка текстом-кнопкой
        </button>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom">
        <p className={preview.panelTextMuted}>
          Триггер — один произвольный элемент (здесь нативная <code>&lt;button&gt;</code> без рамки,
          как текстовая ссылка); на него вешаются ref, <code>aria-expanded</code>,{" "}
          <code>aria-controls</code> и клик для переключения.
        </p>
      </Popover.Content>
    </Popover.Root>
  );
}
