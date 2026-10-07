import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "LoginForm.Root",
      en: "`forwardRef` → `HTMLDivElement`. The sign-in card: card fill, radius and shadow, the tier rhythm; provides its size to the parts. Native `<div>` props.",
      ru: "Карточка входа: заливка, радиус и тень карточки, ритм яруса; передаёт размер частям.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of padding, gaps and text roles; Inputs and Buttons inside without their own `size` take it.",
          ru: "Ярус отступов, зазоров и текста; поля и кнопки внутри без своего `size` берут его.",
        },
        {
          name: "align",
          type: '"start" | "center"',
          default: '"start"',
          en: "`start` — the Modal header layout (rounded accent tile left, title over description right); `center` — a round logo above centered text.",
          ru: "`start` — как шапка Modal (плитка слева, текст справа); `center` — круглый логотип над текстом по центру.",
        },
        {
          name: "flat",
          type: "boolean",
          default: "false",
          en: "Removes the card shadow (inside a Modal or on a plain page). No border either way.",
          ru: "Убирает тень карточки (внутри Modal или на простой странице).",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the card.",
          ru: "Класс на карточке.",
        },
      ],
    },
    {
      name: "LoginForm.Header",
      en: "No ref. `<header>` with the logo, title and description, laid out by Root `align`. Native props.",
      props: [],
    },
    {
      name: "LoginForm.Logo",
      en: "No ref. A tile for the product mark or an icon (accent tile with `start`, round with `center`); decorative unless it has an `aria-label`. Native `<div>` props.",
      props: [],
    },
    {
      name: "LoginForm.Title",
      en: "No ref. The heading (kit Typography, text role by the tier).",
      props: [
        {
          name: "as",
          type: '"h1" | "h2" | "h3"',
          default: '"h1"',
          en: "Heading level; `h2` when the page already has an `h1`.",
          ru: "Уровень заголовка; `h2`, если на странице уже есть `h1`.",
        },
      ],
    },
    {
      name: "LoginForm.Description",
      en: "No ref. The secondary line under the title (kit Typography, secondary tone). Native `<p>` props.",
      props: [],
    },
    {
      name: "LoginForm.Body",
      en: "No ref. Everything under the header: provider buttons, divider, form, footer. Native `<div>` props.",
      props: [],
    },
    {
      name: "LoginForm.Form",
      en: "`forwardRef` → `HTMLFormElement`. The `<form>`: fields, then the submit button, with the field → field gap of the tier. Native form props.",
      props: [],
    },
    {
      name: "LoginForm.Actions",
      en: "No ref. A column of full-width buttons: provider buttons above the form, or the primary action with a `ghost` back action. Native `<div>` props.",
      props: [],
    },
    {
      name: "LoginForm.Footer",
      en: "No ref. The secondary line with a `LinkButton` («Нет аккаунта? Зарегистрироваться»); follows Root `align`. Native `<p>` props.",
      props: [],
    },
  ],
  labels: [],
};
