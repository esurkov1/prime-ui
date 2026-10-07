import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Avatar.Root",
      en: "`ref` → `HTMLDivElement`. The circle: diameter tier and fallback hue; tracks the image load for the Fallback.",
      ru: "Круг: диаметр и оттенок подложки; следит за загрузкой фото для Fallback.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl" | "2xl"',
          default: '"m"',
          en: "Diameter 20 · 24 · 32 · 40 · 48 · 64 px. Inside `Avatar.Group` the group size is used when it is not set.",
          ru: "Диаметр 20 · 24 · 32 · 40 · 48 · 64 px. Внутри `Avatar.Group` без него берётся размер группы.",
        },
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"gray"',
          en: "Palette hue of the fallback; derive it from a stable user id.",
          ru: "Оттенок подложки; выводите его из постоянного id пользователя.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `aria-label` (when no name is shown) and the other div attributes.",
          ru: "`className`, `aria-label` (когда имя не показано) и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Avatar.Image",
      en: "`ref` → `HTMLImageElement`. The photo; hidden while it loads and after an error, so the Fallback shows through. A new `src` starts again.",
      ru: "Фото; скрыто, пока грузится и после ошибки, — видна подложка. Новый `src` начинает загрузку заново.",
      props: [
        {
          name: "src",
          type: "string",
          required: true,
          en: "Photo URL.",
          ru: "Адрес фото.",
        },
        {
          name: "alt",
          type: "string",
          default: '""',
          en: "Empty when the name is written next to the avatar, otherwise the name.",
          ru: "Пустой, когда имя написано рядом, иначе — имя.",
        },
        {
          name: "…rest",
          type: 'Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">',
          en: "`className`, `onLoad`, `onError` and the other img attributes.",
          ru: "`className`, `onLoad`, `onError` и остальные атрибуты img.",
        },
      ],
    },
    {
      name: "Avatar.Fallback",
      en: "A `<span>` with initials or an `Icon` under the photo; `aria-hidden` once the photo has loaded.",
      ru: "`<span>` с инициалами или `Icon` под фото; `aria-hidden`, когда фото загрузилось.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`children`, `className` and the other span attributes.",
          ru: "`children`, `className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Avatar.Status",
      en: 'A presence dot on the bottom-end edge, `role="img"` named by the state, cut out by a ring in `--avatar-ring`.',
      ru: 'Точка присутствия на нижнем крае, `role="img"` с названием состояния, вырезана кольцом цвета `--avatar-ring`.',
      props: [
        {
          name: "status",
          type: '"online" | "offline" | "away" | "busy"',
          required: true,
          en: "Presence state: green, gray, warning or danger dot.",
          ru: "Состояние: зелёная, серая, жёлтая или красная точка.",
        },
        {
          name: "labels",
          type: "Partial<AvatarStatusLabels>",
          en: "Accessible names of the states, see Labels.",
          ru: "Имена состояний для скринридеров, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Avatar.Group",
      en: '`ref` → `HTMLDivElement`. An overlapping row (`role="group"`); members overlap by 25% with a ring in `--avatar-ring`.',
      ru: 'Ряд с наложением (`role="group"`); участники перекрываются на 25% с кольцом цвета `--avatar-ring`.',
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl" | "2xl"',
          default: '"m"',
          en: "Size of every `Avatar.Root` / `Avatar.Overflow` inside without its own `size`.",
          ru: "Размер каждого `Avatar.Root` / `Avatar.Overflow` внутри без своего `size`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`aria-label`, `className` and the other div attributes.",
          ru: "`aria-label`, `className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Avatar.Overflow",
      en: "`ref` → `HTMLDivElement`. The «+N» cell at the end of a group, the same diameter as its avatars.",
      ru: "Ячейка «+N» в конце группы того же диаметра.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl" | "2xl"',
          default: '"m"',
          en: "Diameter; inside `Avatar.Group` the group size when not set.",
          ru: "Диаметр; внутри `Avatar.Group` без него — размер группы.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children` («+3»), `aria-label` («Ещё 3 участника») and the other div attributes.",
          ru: "`children` («+3»), `aria-label` («Ещё 3 участника») и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "online",
      default: "В сети",
      en: "Name of the `online` dot.",
      ru: "Имя точки `online`.",
    },
    {
      key: "offline",
      default: "Не в сети",
      en: "Name of the `offline` dot.",
      ru: "Имя точки `offline`.",
    },
    { key: "away", default: "Отошёл", en: "Name of the `away` dot.", ru: "Имя точки `away`." },
    { key: "busy", default: "Занят", en: "Name of the `busy` dot.", ru: "Имя точки `busy`." },
  ],
};
