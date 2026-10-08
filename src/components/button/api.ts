import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Button.Root",
      en: "`ref` → `HTMLButtonElement`. The `<button>`, or the single child with `asChild`; sets variant, tone and size and passes the tier to nested icons.",
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
          type: '"accent" | "neutral" | "success" | "danger" | "inherit"',
          default: '"accent"',
          en: "Meaning of the action; `danger` for destructive actions; `success` for an action that is done (a payment went through). `inherit` takes the host's text color for an action on a colored host (a solid Banner); it needs `variant` `ghost`, `soft` or `outline`.",
          ru: "Смысл: главное действие, второстепенное, завершённое (`success` — «Оплачено») или разрушительное. `inherit` берёт цвет текста подложки — для действия на цветном фоне; только с `ghost`, `soft` или `outline`.",
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
          name: "progress",
          type: "number",
          en: "Progress of a long action started by the button, `0…1`: a wash of the text color grows inside from the start edge, `aria-busy` is set and the button stays pressable (to cancel). Put the number in the label («Скачивание 42%»); remove the prop when done and the fill fades out.",
          ru: "Прогресс долгого действия, `0…1`: заливка цвета текста растёт от начала кнопки, ставится `aria-busy`, кнопка остаётся нажимаемой (для отмены). Число пишите в подписи («Скачивание 42%»); по завершении уберите проп — заливка погаснет.",
        },
        {
          name: "holdToConfirm",
          type: "boolean",
          default: "false",
          en: "The action needs a held press: the fill runs for 1.2 s (a gesture clock, kept under reduced motion) and `onConfirm` fires at its end. Releasing, leaving or losing focus earlier rolls it back. Space and Enter hold too; the gesture is described to assistive tech by `labels.holdHint`.",
          ru: "Действие требует удержания: заливка идёт 1,2 с (это часы жеста, они остаются и при reduced motion), в конце срабатывает `onConfirm`. Если отпустить, увести указатель или фокус раньше, заливка откатится. Пробел и Enter тоже удерживают; скринридеру жест описывает `labels.holdHint`.",
        },
        {
          name: "onConfirm",
          type: "() => void",
          en: "Fires when a `holdToConfirm` press completes; the action goes here, not in `onClick`.",
          ru: "Срабатывает, когда удержание `holdToConfirm` дошло до конца; действие пишите сюда, а не в `onClick`.",
        },
        {
          name: "labels",
          type: "Partial<ButtonLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Встроенные строки, см. Labels.",
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
          en: "Label and `Button.Icon`. Only `Button.Icon` children → square icon-only button; give it `aria-label`. A changed text label flows into the new one letter by letter while the width glides; a change of digits only («58 с» → «57 с», «42%» → «43%») stays in place.",
          ru: "Подпись и `Button.Icon`. Только `Button.Icon` — квадратная кнопка, ей нужен `aria-label`. Новая подпись перетекает в кнопку по буквам, ширина плывёт; смена одних цифр («58 с» → «57 с», «42%» → «43%») происходит на месте.",
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
      en: "`ref` → `HTMLSpanElement`. Decorative icon wrapper (`aria-hidden`) sized to the button tier.",
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
  labels: [
    {
      key: "holdHint",
      default: "Удерживайте, чтобы подтвердить",
      en: "Description of a `holdToConfirm` button for assistive tech (`aria-describedby`).",
      ru: "Описание кнопки `holdToConfirm` для скринридеров (`aria-describedby`).",
    },
  ],
};
