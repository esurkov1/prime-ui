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
          type: '"solid" | "soft" | "outline" | "ghost" | "shade"',
          default: '"solid"',
          en: 'Visual treatment: fill, soft fill, line or transparent. `shade` — the media shade with a light glyph for a button over a picture or video; with `tone="danger"` — the error disk.',
          ru: 'Подача: заливка, мягкая заливка, линия или прозрачная. `shade` — тень медиа со светлым глифом для кнопки поверх фото или видео; с `tone="danger"` — диск ошибки.',
        },
        {
          name: "shape",
          type: '"square" | "circle"',
          default: '"square"',
          en: "Outline. `circle` — a disk as wide as it is tall, with only a `Button.Icon` inside; same tiers, tones and variants. Requires `aria-label`.",
          ru: "Контур. `circle` — диск, ширина равна высоте, внутри только `Button.Icon`; те же ярусы, тоны и подачи. Нужен `aria-label`.",
        },
        {
          name: "tone",
          type: '"accent" | "neutral" | "success" | "danger" | "inherit"',
          default: '"accent"',
          en: "Meaning: primary, secondary, done (`success`) or destructive (`danger`). `inherit` takes the host's text color for an action on a colored host; only with `ghost`, `soft` or `outline`.",
          ru: "Смысл: главное действие, второстепенное, завершённое (`success`) или разрушительное (`danger`). `inherit` берёт цвет текста подложки — для действия на цветном фоне; только с `ghost`, `soft` или `outline`.",
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
          name: "pressed",
          type: "boolean",
          en: "A toggle button: `true` on, `false` off (`aria-pressed`). On takes the selected look, an accent soft fill that glides in and out. Leave it out for an ordinary action; a set of toggles is a ButtonGroup.",
          ru: "Кнопка-переключатель: `true` — включена, `false` — выключена (`aria-pressed`). Включённая — с заливкой выбора accent soft. Для обычного действия не задавайте; набор переключателей — ButtonGroup.",
        },
        {
          name: "progress",
          type: "number | null",
          en: "Progress of a long action, `0…1`; `null` — the share is unknown. Sets `aria-busy`, stays pressable (to cancel); a square fills from the start edge, a circle draws a ring. Remove the prop when done.",
          ru: "Прогресс долгого действия, `0…1`; `null` — доля неизвестна. Ставит `aria-busy`, кнопка остаётся нажимаемой (для отмены); квадратная заливается от начала, круглая рисует кольцо. По завершении уберите проп.",
        },
        {
          name: "holdToConfirm",
          type: "boolean",
          default: "false",
          en: "The action needs a held press (pointer, `Space` or `Enter`): the fill runs for 1.2 s, then `onConfirm` fires; releasing earlier rolls it back.",
          ru: "Действие требует удержания (указатель, `Space` или `Enter`): заливка идёт 1,2 с, затем срабатывает `onConfirm`; если отпустить раньше, заливка откатится.",
        },
        {
          name: "onConfirm",
          type: "() => void | Promise<void>",
          en: "Fires when a `holdToConfirm` press completes; the action goes here, not in `onClick`. Return the request's promise to keep the button `loading` until it settles.",
          ru: "Срабатывает, когда удержание `holdToConfirm` дошло до конца; действие пишите сюда, а не в `onClick`. Верните промис запроса — кнопка будет в `loading`, пока он не завершится.",
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
          en: "Label and `Button.Icon`. Only `Button.Icon` children → a square icon-only button that needs `aria-label`. A changed label morphs letter by letter.",
          ru: "Подпись и `Button.Icon`. Только `Button.Icon` — квадратная кнопка, ей нужен `aria-label`. Новая подпись перетекает по буквам.",
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
          en: 'The icon, e.g. `<Icon name="action.copy" />`; `Icon` without `size` takes the button tier. A new icon (another `name`) cross-fades in and plays its gesture once (`fast`).',
          ru: 'Иконка, например `<Icon name="action.copy" />`; без `size` берёт ярус кнопки. Новая иконка (другой `name`) перетекает на место старой и один раз играет свой жест (`fast`).',
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
