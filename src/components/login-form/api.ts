import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "LoginForm.Root",
      en: "`ref` → `HTMLDivElement`. The sign-in form: a Card (fill, radius, shadow) capped at a small modal's width, the tier rhythm; provides its size to the parts.",
      ru: "Форма входа: Card (заливка, радиус, тень) не шире малого модального окна, ритм яруса; передаёт размер частям.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier of padding, gaps and text roles; every field and button inside without its own `size` takes it. Without it the form takes the tier of a sized host (a Modal).",
          ru: "Ярус отступов, зазоров и текста; поля и кнопки внутри без своего `size` берут его. Без него форма берёт ярус хоста с размером (Modal).",
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
        {
          name: "children",
          type: "ReactNode",
          en: "The parts: Header, Body.",
          ru: "Части: Header, Body.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "LoginForm.Header",
      en: "`ref` → `HTMLElement`. `<header>` with the logo, title and description, laid out by Root `align`. Native props.",
      ru: "`<header>` с логотипом, заголовком и описанием, раскладка по `align` корня.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "Logo, Title, Description.",
          ru: "Logo, Title, Description.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the element.",
          ru: "Класс на элементе.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "The other header attributes.",
          ru: "Остальные атрибуты шапки.",
        },
      ],
    },
    {
      name: "LoginForm.Logo",
      en: '`ref` → `HTMLDivElement`. A tile for the product mark or an icon (accent tile with `start`, round with `center`); decorative unless it has an `aria-label` — then it is the product mark image (`role="img"`).',
      ru: 'Плитка со знаком продукта или иконкой (акцентная плитка при `start`, круг при `center`); декоративна, пока нет `aria-label`, — с ним это изображение знака продукта (`role="img"`).',
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "The product mark or an `Icon`.",
          ru: "Знак продукта или `Icon`.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the element.",
          ru: "Класс на элементе.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "The other div attributes.",
          ru: "Остальные атрибуты div.",
        },
      ],
    },
    {
      name: "LoginForm.Title",
      en: "`ref` → `HTMLHeadingElement`. The heading (kit Typography, text role by the tier).",
      ru: "Заголовок (Typography кита, роль текста по ярусу).",
      props: [
        {
          name: "as",
          type: '"h1" | "h2" | "h3"',
          default: '"h1"',
          en: "Heading level; `h2` when the page already has an `h1`.",
          ru: "Уровень заголовка; `h2`, если на странице уже есть `h1`.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "The heading text.",
          ru: "Текст заголовка.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the element.",
          ru: "Класс на элементе.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLHeadingElement>",
          en: "The other heading attributes.",
          ru: "Остальные атрибуты заголовка.",
        },
      ],
    },
    {
      name: "LoginForm.Description",
      en: "`ref` → `HTMLParagraphElement`. The secondary line under the title (kit Typography, secondary tone).",
      ru: "Вторичная строка под заголовком (Typography кита, тон secondary).",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "The line text.",
          ru: "Текст строки.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the element.",
          ru: "Класс на элементе.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLParagraphElement>, "children">',
          en: "The other paragraph attributes.",
          ru: "Остальные атрибуты абзаца.",
        },
      ],
    },
    {
      name: "LoginForm.Body",
      en: "`ref` → `HTMLDivElement`. Everything under the header: provider buttons, divider, form, footer.",
      ru: "Всё под шапкой: кнопки провайдеров, разделитель, форма, подвал.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "Actions, `Divider`, Form, Footer.",
          ru: "Actions, `Divider`, Form, Footer.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the element.",
          ru: "Класс на элементе.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "The other div attributes.",
          ru: "Остальные атрибуты div.",
        },
      ],
    },
    {
      name: "LoginForm.Form",
      en: "`ref` → `HTMLFormElement`. The `<form>`: fields, then the submit button, with the field → field gap of the tier. Native form props.",
      ru: "`<form>`: поля, затем кнопка отправки, с зазором поле → поле по ярусу.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "The fields and the Actions.",
          ru: "Поля и Actions.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the element.",
          ru: "Класс на элементе.",
        },
        {
          name: "…rest",
          type: "FormHTMLAttributes<HTMLFormElement>",
          en: "The other form (`onSubmit`, `action`) attributes.",
          ru: "Остальные атрибуты формы (`onSubmit`, `action`).",
        },
      ],
    },
    {
      name: "LoginForm.Actions",
      en: "`ref` → `HTMLDivElement`. A column of full-width buttons: provider buttons above the form, or the primary action with a `ghost` back action.",
      ru: "Колонка кнопок на всю ширину: кнопки провайдеров над формой или главное действие с `ghost`-действием назад.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "The buttons.",
          ru: "Кнопки.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the element.",
          ru: "Класс на элементе.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "The other div attributes.",
          ru: "Остальные атрибуты div.",
        },
      ],
    },
    {
      name: "LoginForm.Footer",
      en: "`ref` → `HTMLParagraphElement`. The secondary line with a `LinkButton` («Нет аккаунта? Зарегистрироваться»); follows Root `align`.",
      ru: "Вторичная строка с `LinkButton` («Нет аккаунта? Зарегистрироваться»); следует `align` корня.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "The line with a `LinkButton`.",
          ru: "Строка с `LinkButton`.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the element.",
          ru: "Класс на элементе.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLParagraphElement>, "children">',
          en: "The other paragraph attributes.",
          ru: "Остальные атрибуты абзаца.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [
      {
        keys: "Enter",
        en: "In a field of the form, submits it.",
        ru: "В поле формы отправляет её.",
        native: true,
      },
    ],
    aria: [
      {
        en: "The title is a real heading (`h1` by default) and the form is a native `<form>`: Enter submits.",
        ru: "Заголовок — настоящий заголовок (`h1` по умолчанию), форма — нативный `<form>`: Enter отправляет её.",
      },
      {
        en: 'The logo is decorative; with an `aria-label` it is the product mark image (`role="img"`).',
        ru: 'Логотип декоративен; с `aria-label` он становится изображением знака продукта (`role="img"`).',
      },
      {
        en: "Give `LoginForm.Form` an `aria-label` (or `aria-labelledby` pointing to the title id) so the form is a landmark.",
        ru: "Дайте `LoginForm.Form` `aria-label` (или `aria-labelledby` на id заголовка), чтобы форма стала ориентиром.",
      },
      {
        en: "Fields use `autoComplete` (`email`, `current-password`, `new-password`, `one-time-code`) so password managers and OTP autofill work.",
        ru: "Поля с `autoComplete` (`email`, `current-password`, `new-password`, `one-time-code`) работают с менеджерами паролей и автозаполнением кода.",
      },
      {
        en: "Field errors come from the fields (`aria-invalid`, described by the error). A refused sign-in has no Banner: the e-mail takes `invalid` and the `error` of the password says why, announced by the support row of the field.",
        ru: "Ошибки полей приходят из самих полей (`aria-invalid`, описание из ошибки). Отказ во входе — без Banner: почта получает `invalid`, а `error` поля пароля называет причину, её озвучивает строка поддержки поля.",
      },
    ],
  },
};
