import { ToggleLeft } from "lucide-react";
import { api } from "@/components/switch/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "switch",
    label: "Switch",
    summary: "Переключатель включено/выключено",
    keywords: ["переключатель", "тумблер", "toggle", "checked", "onCheckedChange"],
    icon: ToggleLeft,
    order: 3,
  },
  dir: "switch",
  title: "Switch",
  kind: "control",
  description:
    "Переключатель «вкл / выкл» для настройки, которая применяется сразу, без кнопки «Сохранить». Если значение уходит только с формой — Checkbox.",
  examples: [
    {
      slot: "overview",
      description: "Настройка, которая применяется сразу, с подсказкой под текстом — `hint`.",
    },
    {
      slot: "sizes",
      description: "Все размеры, дорожка от 24×16 до 44×24; текст берёт ярус контрола — `size`.",
    },
    {
      slot: "states",
      description:
        "Все состояния рядом, каждое подписано своим пропом — `checked`, `readOnly`, `invalid`, `disabled`.",
    },
    {
      scenario: "settings-row",
      title: "Строка настроек",
      description:
        "Строка настроек: текст слева, дорожка без подписи справа — `aria-labelledby`, `aria-describedby`.",
    },
    {
      slot: "controlled",
      description:
        "Состоянием владеет родитель и переписывает подсказку под него — `checked`, `onCheckedChange`.",
    },
    {
      slot: "in-form",
      description:
        "Переключатели в форме: значение попадает в FormData по `name`, обязательный показывает ошибку — `name`, `required`, `error`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Переводит фокус на переключатель." },
      { keys: "Space", action: "Переключает его (кроме `readOnly`)." },
    ],
    aria: [
      'Нативный `<input type="checkbox" role="switch">` с `aria-checked`, скрыт поверх дорожки и обёрнут строкой-`<label>`.',
      "`aria-invalid`, `aria-readonly` и `aria-describedby` (ваши id, затем подсказка или ошибка) — на input.",
      "Без видимого текста назовите его через `aria-label` или `aria-labelledby` на `Switch.Root`.",
    ],
  },
};
