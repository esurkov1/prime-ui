import { api } from "@/components/code-block/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { CodeXml } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "code-block",
    label: "Code Block",
    summary: "Блок кода с подсветкой синтаксиса",
    keywords: ["код", "подсветка", "language"],
    icon: CodeXml,
    order: 9,
  },
  dir: "code-block",
  title: "CodeBlock",
  kind: "primitive",
  description:
    "Статичный фрагмент TypeScript / TSX с подсветкой: на утопленной панели или без неё внутри своей панели хоста.",
  examples: [
    {
      slot: "overview",
      description:
        "Пример ответа API на утопленной панели с именем для скринридеров — `code`, `aria-label`.",
    },
    {
      slot: "variants",
      description: "Утопленная панель и голый блок, который берёт шрифт и фон у хоста — `variant`.",
    },
    {
      scenario: "color-scheme",
      title: "Фиксированная схема",
      description:
        "Блок с зафиксированной схемой выглядит одинаково в обеих темах — `colorScheme`.",
    },
    {
      slot: "narrow",
      description:
        "В узкой колонке длинная строка прокручивается внутри блока и не переносится; Tab, затем стрелки.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Фокус на блоке `soft`, чтобы прокрутить длинный код." },
      { keys: "← · →", action: "Горизонтальная прокрутка блока в фокусе." },
    ],
    aria: [
      "Нативные `<pre>` / `<code>`: скринридер читает текст.",
      "Блок `soft` — точка табуляции (`tabIndex=0`); `tabIndex={-1}`, если он не переполняется.",
      "Самостоятельному блоку задайте `aria-label` («Команда установки»).",
    ],
  },
};
