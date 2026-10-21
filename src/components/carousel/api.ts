import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { CAROUSEL_LABELS } from "./Carousel";

export const api: ComponentApi = {
  parts: [
    {
      name: "Carousel.Root",
      en: "`ref` → `HTMLElement` (the `<section>`). Photos and videos of one record in a box of a fixed ratio, as wide as its container: a finger or a mouse drag swipes them, the dots, the arrows and the keys step, `scrub` lets a hovering mouse pick. The slides never turn by themselves.",
      ru: "Фото и видео одной записи в рамке с фиксированным соотношением сторон, во всю ширину контейнера: палец или перетаскивание мышью листают, точки, стрелки и клавиши шагают, `scrub` даёт выбирать их наведением мыши. Слайды сами не перелистываются.",
      props: [
        {
          name: "items",
          type: "readonly CarouselItem[]",
          required: true,
          en: '`{ type?: "image" | "video", src, alt?, poster?, duration?, autoPlay?, loop? }`. A video shows its first frame or `poster`; `autoPlay` plays it muted while current and in view, `loop` (default `true`).',
          ru: '`{ type?: "image" | "video", src, alt?, poster?, duration?, autoPlay?, loop? }`. Видео показывает первый кадр или `poster`; `autoPlay` играет его без звука, пока он текущий и на экране, `loop` (по умолчанию `true`).',
        },
        {
          name: "ratio",
          type: '"1:1" | "4:3" | "3:2" | "16:10" | "16:9" | "3:4"',
          default: '"4:3"',
          en: "Aspect ratio of the box, width ÷ height; the photos cover it.",
          ru: "Соотношение сторон рамки, ширина ÷ высота; фото заполняют её с обрезкой.",
        },
        {
          name: "loop",
          type: "boolean",
          default: "false",
          en: "Past the last slide comes the first, and back (with three slides or more); without it an end resists the finger and the arrow there leaves.",
          ru: "За последним слайдом идёт первый, и обратно (от трёх слайдов); без него край пружинит под пальцем, а стрелка на краю уходит.",
        },
        {
          name: "index",
          type: "number",
          en: "The current slide (controlled); together with `onIndexChange`.",
          ru: "Текущий слайд (управляемое); вместе с `onIndexChange`.",
        },
        {
          name: "defaultIndex",
          type: "number",
          default: "0",
          en: "The slide shown first (uncontrolled).",
          ru: "Слайд, показанный первым (неуправляемое).",
        },
        {
          name: "onIndexChange",
          type: "(index: number) => void",
          en: "The slide changed: a swipe, the scrub, a dot, an arrow, a key — at once, while the track still glides.",
          ru: "Слайд сменился: свайп, наведение, точка, стрелка, клавиша — сразу, пока лента ещё едет.",
        },
        {
          name: "arrows",
          type: "boolean",
          default: "false",
          en: 'Previous and next buttons (`Button shape="circle" variant="shade"`) at the sides: shown while the pointer is over the box or the focus is in it, always on a touch screen.',
          ru: 'Кнопки «назад» и «вперёд» (`Button shape="circle" variant="shade"`) по бокам: видны, пока указатель над рамкой или фокус внутри, на сенсорном экране — всегда.',
        },
        {
          name: "dots",
          type: "boolean",
          default: "true",
          en: "A dot per slide centred on the bottom line, the current one a pill that follows the track; `false` leaves them and their fade out. Never for one slide.",
          ru: "Точка на каждый слайд по центру нижней линии, текущая — капсула, идущая за лентой; `false` убирает их и затенение под ними. Для одного слайда их нет.",
        },
        {
          name: "scrub",
          type: "boolean",
          default: "false",
          en: "A hovering mouse shows the slide of the zone under it (the width split in as many zones); leaving the box brings back the slide it found — a quick look along a catalogue. Starts a moment after mount.",
          ru: "Мышь показывает слайд зоны под собой (ширина делится на столько зон); уход с рамки возвращает прежний слайд — быстрый взгляд по каталогу. Включается через мгновение после появления.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The record loads: a Skeleton fills the box; the slides replace it in place.",
          ru: "Запись загружается: рамку занимает Skeleton; слайды встают на его место.",
        },
        {
          name: "onItemOpen",
          type: "(index: number) => void",
          en: "A press on the slide (not after a swipe, not on a dot or an arrow), Enter or Space on the focused carousel: open the item — in `MediaViewer`, which opens out of the picture on screen.",
          ru: "Нажатие на слайд (не после свайпа, не на точке или стрелке), Enter или Space на карусели в фокусе: открыть элемент — в `MediaViewer`, который сам раскроется из картинки на экране.",
        },
        {
          name: "renderOverlay",
          type: "(item: CarouselItem, index: number) => ReactNode",
          en: "The slide's own `Carousel.Overlay` parts («Царапина на крыле»): they travel with their slide and continue the row of the carousel's overlays in the corner.",
          ru: "Собственные части `Carousel.Overlay` слайда («Царапина на крыле»): едут вместе со своим слайдом и продолжают ряд наложений карусели в углу.",
        },
        {
          name: "labels",
          type: "Partial<CarouselLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "aria-label",
          type: "string",
          en: "The name of the carousel; default `labels.region`.",
          ru: "Имя карусели; по умолчанию `labels.region`.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Carousel.Overlay` parts of the carousel: they stand still while the slides change.",
          ru: "Части `Carousel.Overlay` карусели: стоят на месте, пока меняются слайды.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "defaultValue" | "onChange">',
          en: "`className`, pointer and key handlers and the other attributes of the `<section>`.",
          ru: "`className`, обработчики указателя и клавиш и прочие атрибуты `<section>`.",
        },
      ],
    },
    {
      name: "Carousel.Overlay",
      en: "`ref` → `HTMLDivElement`. Content on the media in a corner — a status Badge, a plate: a child of the root stands still, one from `renderOverlay` travels with its slide. A corner is one row, nearest the corner first, all the edge beside an empty one; what does not fit steps aside.",
      ru: "Содержимое поверх медиа в углу — Badge статуса, госномер: потомок корня стоит на месте, часть из `renderOverlay` едет со своим слайдом. Угол — один ряд, от угла по порядку, рядом с пустым — на весь край; не поместившееся уступает место.",
      props: [
        {
          name: "placement",
          type: '"top-start" | "top-end" | "bottom-start" | "bottom-end"',
          default: '"top-start"',
          en: "The corner; the four stand the same inset from the edges, the bottom ones on the line of the dots. A video slide puts its length and sound button in its bottom-end corner.",
          ru: "Угол; все четыре на одном отступе от краёв, нижние — на линии точек. Слайд с видео ставит длительность и кнопку звука в свой нижний конечный угол.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`children`, `className` and the other attributes.",
          ru: "`children`, `className` и прочие атрибуты.",
        },
      ],
    },
  ],
  labels: labelRows(CAROUSEL_LABELS, {
    region: {
      en: "The name of the carousel when no `aria-label` is given.",
      ru: "Имя карусели, если не задан `aria-label`.",
    },
    carousel: {
      en: "What the carousel is to assistive tech (`aria-roledescription`).",
      ru: "Чем является карусель для вспомогательных технологий (`aria-roledescription`).",
    },
    slide: {
      en: "What a slide is to assistive tech (`aria-roledescription`).",
      ru: "Чем является слайд для вспомогательных технологий (`aria-roledescription`).",
    },
    photo: {
      en: "The name of a photo slide and of its dot, read out when it becomes current; `{current}` and `{total}`.",
      ru: "Имя слайда с фото и его точки, зачитывается, когда слайд становится текущим; `{current}` и `{total}`.",
    },
    video: {
      en: "The name of a video slide and of its dot; `{current}` and `{total}`.",
      ru: "Имя слайда с видео и его точки; `{current}` и `{total}`.",
    },
    previous: { en: "The arrow back (`arrows`).", ru: "Стрелка назад (`arrows`)." },
    next: { en: "The arrow forward (`arrows`).", ru: "Стрелка вперёд (`arrows`)." },
    mute: {
      en: "The sound button of a playing video while its sound is on.",
      ru: "Кнопка звука играющего видео, пока звук включён.",
    },
    unmute: {
      en: "The sound button of a playing video while it is muted.",
      ru: "Кнопка звука играющего видео, пока звук выключен.",
    },
    empty: {
      en: "The name of the empty tile (no `items`).",
      ru: "Имя пустой плитки (нет `items`).",
    },
    loadError: {
      en: "The name of the tile of a photo or a video that failed to load.",
      ru: "Имя плитки фото или видео, которое не загрузилось.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focuses the carousel, then the arrows (`arrows`) and the current dot.",
        ru: "Фокус на карусели, затем на стрелках (`arrows`) и текущей точке.",
        native: true,
      },
      {
        keys: "ArrowLeft · ArrowRight",
        en: "On the carousel or a dot: the previous and the next slide (the focus follows to the new dot); at an end without `loop` the track nudges back.",
        ru: "На карусели или точке: предыдущий и следующий слайд (фокус переходит на новую точку); на краю без `loop` лента пружинит.",
      },
      {
        keys: "Home · End",
        en: "The first and the last slide.",
        ru: "Первый и последний слайд.",
      },
      {
        keys: "Enter · Space",
        en: "On the carousel: opens the current item (`onItemOpen`); on a dot or an arrow: presses it.",
        ru: "На карусели: открывает текущий элемент (`onItemOpen`); на точке или стрелке: нажимает её.",
      },
    ],
    aria: [
      {
        en: 'A `<section>` with `aria-roledescription="карусель"` named by `aria-label` or `labels.region`; every slide is a `role="group"` with `aria-roledescription="слайд"` named «Фото 2 из 5»; the slides out of view are `aria-hidden` and `inert` (WAI-ARIA APG carousel).',
        ru: '`<section>` с `aria-roledescription="карусель"` и именем из `aria-label` или `labels.region`; каждый слайд — `role="group"` с `aria-roledescription="слайд"` и именем «Фото 2 из 5»; слайды вне рамки скрыты (`aria-hidden`, `inert`) (WAI-ARIA APG carousel).',
      },
      {
        en: "A slide change by a key, a dot, an arrow or a swipe is read out by a polite live region («Фото 2 из 5»); the mouse scrub is not.",
        ru: "Смена слайда клавишей, точкой, стрелкой или свайпом зачитывается вежливым живым регионом («Фото 2 из 5»); перебор мышью — нет.",
      },
      {
        en: "A dot is a `<button>` named like its slide; the current one has `aria-current` and is wider, so the place is not told by color alone. Only the current dot is a Tab stop.",
        ru: "Точка — `<button>` с именем своего слайда; текущая — с `aria-current` и шире остальных, так что место передаётся не только цветом. В порядке Tab только текущая точка.",
      },
      {
        en: "Every gesture has a single-pointer alternative: the dots and the arrows step, the keys move (WCAG 2.5.1). The slides never turn by themselves (WCAG 2.2.2).",
        ru: "У каждого жеста есть замена одним указателем: точки и стрелки шагают, клавиши листают (WCAG 2.5.1). Слайды сами не перелистываются (WCAG 2.2.2).",
      },
      {
        en: "A video's play mark is decorative and its length is text; name it with `alt`. An `autoPlay` clip plays muted and has its sound button (`labels.unmute` / `labels.mute`) while it plays; with sound it is the one sound of the page.",
        ru: "Знак воспроизведения видео декоративен, длительность — текст; имя задаёт `alt`. Ролик с `autoPlay` играет без звука и, пока играет, показывает кнопку звука (`labels.unmute` / `labels.mute`); со звуком он — единственный звук на странице.",
      },
    ],
  },
};
