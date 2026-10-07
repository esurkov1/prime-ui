/**
 * The Typography component page. It is rendered inside the Typography foundation page (tokens
 * first, then the component) and re-exported by `sections/TypographySection.tsx`, where the docs
 * contract looks for page configs.
 */
import { api } from "@/components/typography/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "typography",
  title: "Typography",
  kind: "primitive",
  description:
    "Текстовые роли шкалы Golos Text на любом текстовом элементе: заголовки, основной текст, подписи и код вне компонентов, которые оформляют свой текст сами.",
  examples: [
    {
      slot: "overview",
      description:
        "Заголовок блока, текст и строка меты — каждый со своей ролью и тегом — `variant`, `as`, `tone`.",
    },
    {
      slot: "variants",
      description:
        "Все роли от display до caption и code, затем все цвета на основном тексте — `variant`, `tone`.",
    },
    {
      scenario: "weights",
      title: "Начертание",
      description:
        "Одна роль с другим начертанием, трекингом или курсивом — `weight`, `tracking`, `italic`.",
    },
    {
      scenario: "inline-emphasis",
      title: "Акцент в тексте",
      description:
        "Значения выделены внутри текста вложенными span с другим начертанием — `as`, `weight`.",
    },
    {
      scenario: "semantic-tag",
      title: "Семантический тег",
      description:
        "Тег следует структуре страницы, а роль — виду: заголовок раздела может быть `h2` размера title — `as`.",
    },
    {
      scenario: "truncate",
      title: "Обрезка строки",
      description:
        "Длинное название в одну строку с многоточием; полный текст остаётся в подсказке — `truncate`, `title`.",
    },
    {
      scenario: "article",
      title: "Статья",
      description:
        "Статья справки из ориентиров, заголовков и цитаты на ширине чтения — `as`, `variant`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Уровень заголовка задаёт `as` по структуре страницы, вид — `variant`: не пропускайте уровни ради размера.",
      "Цвет `tone` не несёт смысл один — статус называйте словом.",
      "У `truncate` полный текст передайте в `title`, если он важен.",
    ],
  },
};

export function TypographyComponentDocs() {
  return <ComponentPage page={page} />;
}
