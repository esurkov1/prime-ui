import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { BUTTON_LABELS } from "./Button";

export const api: ComponentApi = {
  parts: [
    {
      name: "Button.Root",
      en: "`ref` → `HTMLButtonElement`. The `<button>`, or the single child with `asChild`; sets variant, tone and size and passes the tier to nested icons.",
      ru: "`<button>` или единственный дочерний элемент при `asChild`; задаёт подачу, тон и размер, передаёт ярус вложенным иконкам.",
      props: [
        {
          name: "variant",
          type: '"solid" | "soft" | "outline" | "ghost" | "shade" | "glass"',
          default: '"solid"',
          en: 'Visual treatment: fill, soft fill, line or transparent. `shade` — the media shade for a button over a picture or video (with `tone="danger"`, the error disk); `glass` — the glass of a floating bar.',
          ru: 'Подача: заливка, мягкая заливка, линия или прозрачная. `shade` — тень медиа для кнопки поверх фото или видео (с `tone="danger"` — диск ошибки); `glass` — стекло плавающей панели.',
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
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Control tier: height 28 · 32 · 36 · 40 · 48, padding, text, icon, radius. Without it the button takes the tier of its host (LoginForm, Popover, a field, a panel with a size), else `m`.",
          ru: "Ярус контрола: высота 28 · 32 · 36 · 40 · 48, отступы, кегль, иконка. Совпадает с Input и Select того же размера. Без него кнопка берёт ярус контейнера (LoginForm, Popover, поле, панель с размером), иначе `m`.",
        },
        {
          name: "density",
          type: '"regular" | "tight" | "inline"',
          default: '"regular"',
          en: "`tight` — a number in a row of controls: tabular figures and 4px side air, so two digits stay square (page numbers). `inline` — a chip inside a line of text, as tall as the line, in its type.",
          ru: "`tight` — число в ряду контролов: табличные цифры и поля 4px, две цифры остаются квадратом (номера страниц). `inline` — чип внутри строки текста, высотой в строку, её шрифтом.",
        },
        {
          name: "align",
          type: '"center" | "start"',
          default: '"center"',
          en: "Where the content sits: `start` reads from the start edge, for a column of choices (presets).",
          ru: "Где стоит содержимое: `start` — от начального края, для столбца вариантов (пресеты).",
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
          en: "A `Spinner` takes the leading icon's glyph (or stands over the label), sets `aria-busy`, blocks clicks; width does not change. With `asChild` no spinner is added — the child owns its content.",
          ru: "`Spinner` встаёт на место глифа ведущей иконки (или над подписью), `aria-busy` и запрет нажатия; ширина не меняется. С `asChild` спиннер не добавляется — содержимым владеет ребёнок.",
        },
        {
          name: "pressed",
          type: "boolean",
          en: "A toggle button: `true` on, `false` off (`aria-pressed`); on takes the selected look (accent soft). Leave the triad out for an ordinary action; a set of toggles is a ButtonGroup.",
          ru: "Кнопка-переключатель: `true` — включена, `false` — выключена (`aria-pressed`); включённая — с заливкой выбора accent soft. Для обычного действия триаду не задавайте; набор — ButtonGroup.",
        },
        {
          name: "defaultPressed",
          type: "boolean",
          en: "The initial state of an uncontrolled toggle; a click, `Enter` or `Space` flips it.",
          ru: "Начальное состояние неуправляемого переключателя; клик, `Enter` или `Space` меняют его.",
        },
        {
          name: "onPressedChange",
          type: "(pressed: boolean) => void",
          en: "Fires with the new state when the toggle is pressed; an `onClick` that calls `preventDefault()` keeps the state.",
          ru: "Вызывается с новым состоянием при нажатии переключателя; `onClick` с `preventDefault()` сохраняет состояние.",
        },
        {
          name: "current",
          type: "boolean",
          default: "false",
          en: 'The current page of a set (a page number): `aria-current="page"` and the selected look. A router link with its own `aria-current` gets the same look.',
          ru: 'Текущая страница набора (номер страницы): `aria-current="page"` и заливка выбора. Ссылка роутера со своим `aria-current` выглядит так же.',
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
          en: "Fires when a `holdToConfirm` press completes or a `countdown` runs out: the action (or, in `undo` mode, the window's end) goes here, not in `onClick`. A promise keeps a held button `loading` until it settles.",
          ru: "Срабатывает, когда удержание `holdToConfirm` дошло до конца или истёк `countdown`: действие (в режиме `undo` — конец окна) пишите сюда, а не в `onClick`. Промис держит удержанную кнопку в `loading`.",
        },
        {
          name: "countdown",
          type: "number",
          en: "Seconds of an undo window: the button fills over them and counts them down; a press is `onClick`, the end `onConfirm` — what they mean is `countdownMode`.",
          ru: "Секунды окна отмены: кнопка заливается и отсчитывает их; нажатие — `onClick`, конец — `onConfirm`, их смысл задаёт `countdownMode`.",
        },
        {
          name: "countdownMode",
          type: '"undo" | "delay"',
          default: '"undo"',
          en: "`undo` — the action is already done: the `countdown` is the window to undo it (`onClick`), `onConfirm` closes it. `delay` — the action waits: `onConfirm` runs it at the end, a press cancels.",
          ru: "`undo` — действие уже выполнено: `countdown` — окно, чтобы его откатить (`onClick`), `onConfirm` закрывает окно. `delay` — действие ждёт: `onConfirm` выполняет его в конце, нажатие отменяет.",
        },
        {
          name: "countdownPlacement",
          type: '"start" | "end"',
          default: '"end"',
          en: "Where the `countdown` seconds stand: `end` — in a badge after the label, `start` — before it.",
          ru: "Где стоят секунды `countdown`: `end` — в бейдже после текста, `start` — перед ним.",
        },
        {
          name: "labels",
          type: "Partial<ButtonLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          en: "Merges Button props and styles onto the single child element (a link) instead of rendering `<button>`. `disabled`/`loading` become `aria-disabled`; `progress` and `holdToConfirm` need a `<button>`.",
          ru: "Передаёт пропсы и стили Button единственному дочернему элементу (ссылке) вместо `<button>`. `disabled`/`loading` становятся `aria-disabled`; `progress` и `holdToConfirm` требуют `<button>`.",
        },
        {
          name: "disabled",
          type: "boolean",
          en: "Disabled state; `loading` also disables. With `asChild` the child leaves the Tab order and a link loses its `href`.",
          ru: "Неактивное состояние; `loading` тоже блокирует нажатие. С `asChild` ребёнок выходит из порядка Tab, ссылка теряет `href`.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Label and `Button.Icon`. Only `Button.Icon` children → a square icon-only button that needs `aria-label`. A changed label morphs letter by letter. With `asChild`, the one child element; its text is the label too.",
          ru: "Подпись и `Button.Icon`. Только `Button.Icon` — квадратная кнопка, ей нужен `aria-label`. Новая подпись перетекает по буквам. С `asChild` — единственный дочерний элемент; его текст — тоже подпись.",
        },
        {
          name: "aria-label",
          type: "string",
          en: 'The name of a button without a visible label; required with `shape="circle"`.',
          ru: 'Имя кнопки без видимой подписи; обязателен при `shape="circle"`.',
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "aria-pressed">',
          en: '`onClick`, `type` (`"button"` by default, not passed on with `asChild`), `className`, `aria-*`, `data-*` and the other button attributes.',
          ru: '`onClick`, `type` (по умолчанию `"button"`, при `asChild` не передаётся), `className`, `aria-*`, `data-*` и остальные атрибуты кнопки.',
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
          ru: 'Иконка, например `<Icon name="action.copy" />`; `Icon` без `size` берёт ярус кнопки. Новая иконка (другой `name`) перетекает на место старой и один раз играет свой жест (`fast`).',
        },
        {
          name: "className",
          type: "string",
          en: "Class on the icon box.",
          ru: "Класс на блоке иконки.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "The other span attributes.",
          ru: "Остальные атрибуты span.",
        },
      ],
    },
  ],
  labels: labelRows(BUTTON_LABELS, {
    holdHint: {
      en: "Description of a `holdToConfirm` button for assistive tech (`aria-describedby`).",
      ru: "Описание кнопки `holdToConfirm` для скринридеров (`aria-describedby`).",
    },
    countdownHint: {
      en: 'Description of a `countdownMode="delay"` button (`aria-describedby`): when the action runs and that a press cancels it; `{seconds}` is the count.',
      ru: 'Описание кнопки `countdownMode="delay"` (`aria-describedby`): когда выполнится действие и что нажатие его отменит; `{seconds}` — длина отсчёта.',
    },
    undoHint: {
      en: 'Description of a `countdownMode="undo"` button (`aria-describedby`): the action is done and a press undoes it for `{seconds}` s.',
      ru: 'Описание кнопки `countdownMode="undo"` (`aria-describedby`): действие выполнено, нажатие откатит его ещё `{seconds}` с.',
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space",
        en: "Presses the button (native `<button>`); a toggle flips its state; with `holdToConfirm` the key is held until the fill completes.",
        ru: "Нажимает кнопку (нативное поведение `<button>`); переключатель меняет состояние; с `holdToConfirm` клавишу держат, пока не дойдёт заливка.",
      },
      {
        keys: "Tab",
        en: "Moves focus; a disabled button is skipped, the `asChild` child too (`tabIndex=-1`, `aria-disabled`); under a `Tooltip.Trigger` a disabled button stays a tab stop (`aria-disabled`) so its tooltip is reachable.",
        ru: "Переводит фокус; неактивная кнопка пропускается, ребёнок `asChild` тоже (`tabIndex=-1`, `aria-disabled`); в `Tooltip.Trigger` неактивная кнопка остаётся точкой Tab (`aria-disabled`), чтобы подсказка была доступна.",
      },
    ],
    aria: [
      {
        en: 'Native `<button>`, `type="button"` by default, so it never submits a form by accident.',
        ru: 'Нативный `<button>`, по умолчанию `type="button"`: случайно не отправит форму.',
      },
      {
        en: "Icon-only buttons need `aria-label`; `Button.Icon` is `aria-hidden`.",
        ru: "Кнопке только с иконкой нужен `aria-label`; `Button.Icon` скрыт (`aria-hidden`).",
      },
      {
        en: "`progress` is visual only: put the share in the label or in `aria-describedby` («Скачивание 42%»).",
        ru: "`progress` виден только глазами: долю пишите в подпись или в `aria-describedby` («Скачивание 42%»).",
      },
      {
        en: '`shape="circle"` requires `aria-label`; its `progress` ring is `aria-hidden`, the share goes in the label or description («Отменить отправку», described by «Отправка 45%»).',
        ru: '`shape="circle"` требует `aria-label`; кольцо `progress` скрыто (`aria-hidden`), долю называет подпись или описание («Отменить отправку» с описанием «Отправка 45%»).',
      },
      {
        en: '`loading` sets `aria-busy="true"` and blocks the press; `progress` sets `aria-busy` and keeps the button pressable.',
        ru: '`loading` ставит `aria-busy="true"` и блокирует нажатие; `progress` тоже ставит `aria-busy`, но кнопка остаётся нажимаемой.',
      },
      {
        en: "`holdToConfirm` describes the gesture through `aria-describedby` (`labels.holdHint`); `Space` / `Enter` hold like a pointer.",
        ru: "`holdToConfirm` описывает жест через `aria-describedby` (`labels.holdHint`); `Space` / `Enter` удерживаются как указатель.",
      },
      {
        en: 'A disabled button under a `Tooltip.Trigger` is `aria-disabled="true"` with no native `disabled`: it keeps its tab stop and hover, the press and a form submit are blocked.',
        ru: 'Неактивная кнопка в `Tooltip.Trigger` — `aria-disabled="true"` без нативного `disabled`: остаётся точкой Tab и получает наведение, нажатие и отправка формы заблокированы.',
      },
      {
        en: "A changed label is announced once: the animated letters are hidden, the name is the new text.",
        ru: "Смена подписи читается один раз: буквы анимации скрыты, имя кнопки — новый текст целиком.",
      },
      {
        en: 'With `asChild` the disabled state is `aria-disabled="true"` without a native `disabled`; a link child loses its `href`.',
        ru: 'С `asChild` неактивное состояние — `aria-disabled="true"` без нативного `disabled`; ссылка теряет `href`.',
      },
      {
        en: 'A toggle (`pressed`, `defaultPressed` or `onPressedChange`) carries `aria-pressed`; `current` sets `aria-current="page"`. Both are named states, never color alone: the selected fill comes with the attribute.',
        ru: 'Переключатель (`pressed`, `defaultPressed` или `onPressedChange`) несёт `aria-pressed`; `current` ставит `aria-current="page"`. Оба состояния названы атрибутом, не только цветом заливки.',
      },
    ],
  },
};
