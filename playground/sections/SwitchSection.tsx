import { api } from "@/components/switch/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { ToggleLeft } from "../icons";

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
        "Все состояния рядом, каждое подписано своим пропом — `defaultChecked`, `readOnly`, `invalid`, `loading`, `disabled`.",
    },
    {
      scenario: "settings-row",
      title: "Строка настроек",
      description:
        "Строка настроек: текст слева, дорожка без подписи справа — `aria-labelledby`, `aria-describedby`.",
    },
    {
      scenario: "full-width",
      title: "Строка настроек",
      description:
        "Строки настроек: текст слева, дорожка справа, у одной подсказка — `fullWidth`, `hint`.",
    },
    {
      scenario: "saving",
      title: "Сохранение на сервере",
      description:
        "Настройка применяется на сервере сразу: бегунок ждёт на новом месте со спиннером, а отказ сервера плавно возвращает его и объясняет причину — `onCheckedChange`, `error`.",
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
};
