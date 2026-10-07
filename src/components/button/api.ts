import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Button.Root",
      en: "`forwardRef` → `HTMLButtonElement`. The `<button>`, or the single child with `asChild`; sets variant, tone and size and passes the tier to nested icons.",
      ru: "Кнопка или слот для одного дочернего элемента при `asChild`; задаёт подачу, тон и размер, передаёт ярус вложенным иконкам.",
      props: [
        {
          name: "variant",
          type: '"solid" | "soft" | "outline" | "ghost"',
          default: '"solid"',
          en: "Visual treatment.",
          ru: "Подача: заливка, мягкая заливка, линия или прозрачная.",
        },
        {
          name: "tone",
          type: '"accent" | "neutral" | "danger"',
          default: '"accent"',
          en: "Meaning of the action; `danger` for destructive actions.",
          ru: "Смысл: главное действие, второстепенное или разрушительное.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Control tier: height 28 · 32 · 36 · 40 · 48, padding, text, icon, radius. Without it the button takes the tier of its host (LoginForm, Popover, a field, a panel with a size), else `m`.",
          ru: "Ярус контрола: высота 28 · 32 · 36 · 40 · 48, отступы, кегль, иконка. Совпадает с Input и Select того же размера. Без него кнопка берёт ярус контейнера (LoginForm, Popover, поле, панель с размером), иначе `m`.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          en: "Stretches to the container width.",
          ru: "Растянуть кнопку на ширину контейнера.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "Shows a `Spinner` in place of the leading icon or over the label, sets `aria-busy`, blocks clicks; width does not change. With `asChild` no spinner is added — the child owns its content.",
          ru: "Спиннер вместо ведущей иконки или по центру над подписью, `aria-busy` и запрет нажатия. Ширина не меняется.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Merges Button props and styles onto the single child element instead of rendering `<button>`. `disabled`/`loading` become `aria-disabled`.",
          ru: "Передать стили и пропсы единственному дочернему элементу вместо `<button>`.",
        },
        {
          name: "type",
          type: '"button" | "submit" | "reset"',
          default: '"button"',
          en: "Native button type; not forwarded with `asChild`.",
          ru: "Тип нативной кнопки; при `asChild` не передаётся.",
        },
        {
          name: "disabled",
          type: "boolean",
          en: "Disabled state; `loading` also disables.",
          ru: "Неактивное состояние; `loading` тоже блокирует нажатие.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Label and `Button.Icon`. Only `Button.Icon` children → square icon-only button; give it `aria-label`.",
          ru: "Подпись и `Button.Icon`. Только `Button.Icon` — квадратная кнопка, ей нужен `aria-label`.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size">',
          en: "`onClick`, `className`, `aria-*`, `data-*` and the other button attributes.",
          ru: "`onClick`, `className`, `aria-*`, `data-*` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "Button.Icon",
      en: "No ref. Decorative icon wrapper (`aria-hidden`) sized to the button tier.",
      ru: "Иконка размера яруса кнопки; скрыта от скринридеров (`aria-hidden`).",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon, e.g. `<Icon name="action.copy" />`; `Icon` without `size` takes the button tier.',
          ru: 'Иконка, например `<Icon name="action.copy" />`; без `size` берёт ярус кнопки.',
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: [],
};
