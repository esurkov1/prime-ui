export const primitiveTokens = {
  /** Цвета: white/black, нейтраль `gray`, палитры 50–950. */
  color: {
    white: "#f8f7f4",
    black: "#0f1115",
    /** Скрим модалок/оверлеев (значения вынесены из семантики). */
    overlay: {
      scrimLight: "rgba(15, 17, 21, 0.58)",
      scrimDark: "rgba(8, 10, 14, 0.78)",
    },
    /** Нейтраль: шкала 50–950 + `0` (бумага), альфы для оверлеев. */
    gray: {
      0: "#f8f7f4",
      50: "#f3f4f7",
      100: "#eceef2",
      200: "#dde1e8",
      300: "#c7ced9",
      400: "#9ba6b6",
      500: "#707c8e",
      600: "#566174",
      700: "#3f495a",
      800: "#2b3342",
      900: "#1b2230",
      950: "#121823",
      alpha10: "rgba(112, 124, 142, 0.10)",
      alpha16: "rgba(112, 124, 142, 0.16)",
      alpha24: "rgba(112, 124, 142, 0.24)",
    },
    /** Палитра red: шкала 50–950 (ориентир — Tailwind v3). */
    red: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a",
    },
    /** Палитра blue: шкала 50–950 (ориентир — Tailwind v3). */
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    /** Палитра green: шкала 50–950 (ориентир — Tailwind v3). */
    green: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },
    /** Палитра orange: шкала 50–950 (ориентир — Tailwind v3). */
    orange: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
      950: "#431407",
    },
    /** Палитра yellow: шкала 50–950 (ориентир — Tailwind v3). */
    yellow: {
      50: "#fefce8",
      100: "#fef9c3",
      200: "#fef08a",
      300: "#fde047",
      400: "#facc15",
      500: "#eab308",
      600: "#ca8a04",
      700: "#a16207",
      800: "#854d0e",
      900: "#713f12",
      950: "#422006",
    },
    /** Палитра purple: шкала 50–950 (ориентир — Tailwind v3). */
    purple: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
      950: "#3b0764",
    },
    /** Палитра sky: шкала 50–950 (ориентир — Tailwind v3). */
    sky: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      950: "#082f49",
    },
    /** Палитра pink: шкала 50–950 (ориентир — Tailwind v3). */
    pink: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
      950: "#500724",
    },
    /** Палитра teal: шкала 50–950 (ориентир — Tailwind v3). */
    teal: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
      950: "#042f2e",
    },
  },
  /** Высота ряда / блока: ось `xs`→`6xl`, шаг **+0.25rem**; в семантике контролы — xs…xl. */
  size: {
    xs: "1.75rem",
    s: "2rem",
    m: "2.25rem",
    l: "2.5rem",
    xl: "2.75rem",
    "2xl": "3rem",
    "3xl": "3.25rem",
    "4xl": "3.5rem",
    "5xl": "3.75rem",
    "6xl": "4rem",
  },
  /**
   * Кольцевой прогресс: диаметр в rem (как в макете) и толщина штриха в px.
   * TS читает те же значения, что и визуальная шкала компонента.
   */
  progressCircle: {
    s: { diameter: "2.5625rem", strokeWidth: "3" },
    m: { diameter: "3.375rem", strokeWidth: "4" },
    l: { diameter: "4.25rem", strokeWidth: "5" },
    xl: { diameter: "5.125rem", strokeWidth: "6" },
  },
  /** Отступы: `layout` — сетка макета; `control` — ритм внутри контролов. */
  spaces: {
    /** Сетка макета: шаг **0.25rem (4px)**, ось `xs`→`6xl` + `0`; `spacing.x*` — шаги по 4px. */
    layout: {
      0: "0",
      xs: "0.25rem",
      s: "0.5rem",
      m: "0.75rem",
      l: "1rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
      "5xl": "3rem",
      "6xl": "3.5rem",
    },
    /** Контролы: горизонтальный ритм (`spacing`) и отступ кнопки (`button`). */
    control: {
      /** Gap и inputPaddingX: ось `xs`→`6xl`, шаг **+0.125rem**. */
      spacing: {
        xs: "0.375rem",
        s: "0.5rem",
        m: "0.625rem",
        l: "0.75rem",
        xl: "0.875rem",
        "2xl": "1rem",
        "3xl": "1.125rem",
        "4xl": "1.25rem",
        "5xl": "1.375rem",
        "6xl": "1.5rem",
      },
      /** Padding кнопки: на **+0.125rem** больше соответствующего `spacing.*`. */
      button: {
        xs: "0.5rem",
        s: "0.625rem",
        m: "0.75rem",
        l: "0.875rem",
        xl: "1rem",
        "2xl": "1.125rem",
        "3xl": "1.25rem",
        "4xl": "1.375rem",
        "5xl": "1.5rem",
        "6xl": "1.625rem",
      },
    },
  },
  /** Скругления: ось `xs`→`6xl` + `circle`; контролы — xs…xl, крупные поверхности — 3xl…6xl. */
  radius: {
    0: "0",
    xs: "8px",
    s: "10px",
    m: "11px",
    l: "12px",
    xl: "13px",
    "2xl": "16px",
    "3xl": "20px",
    "4xl": "24px",
    "5xl": "32px",
    "6xl": "40px",
    round: "9999px",
  },
  /** Иконки и маркеры: ось `xs`→`6xl`, шаг **+0.125rem**. */
  icon: {
    xs: "0.75rem",
    s: "0.875rem",
    m: "1rem",
    l: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.375rem",
    "3xl": "1.5rem",
    "4xl": "1.625rem",
    "5xl": "1.75rem",
    "6xl": "1.875rem",
  },
  /** Типографика: семейства, кегль, интерлиньяж, вес, трекинг. */
  font: {
    /** Гарнитуры: базовая и моноширинная. */
    family: {
      base: '"Roboto Flex", "Roboto", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    },
    /**
     * Кегль: ось `3xs`→`6xl` (+0.125rem), плюс **7xl–9xl** под [MD3 type scale](https://m3.material.io/styles/typography/type-scale-tokens)
     * (Display) и **labelMicro** (11px — Label Small).
     */
    size: {
      "3xs": "0.625rem",
      "2xs": "0.75rem",
      xs: "0.875rem",
      s: "1rem",
      m: "1.125rem",
      l: "1.25rem",
      xl: "1.375rem",
      "2xl": "1.5rem",
      "3xl": "1.625rem",
      "4xl": "1.75rem",
      "5xl": "1.875rem",
      "6xl": "2rem",
      "7xl": "2.25rem",
      "8xl": "2.8125rem",
      "9xl": "3.5625rem",
      labelMicro: "0.6875rem",
    },
    /** Межстрочный интервал под шкалу `font.size.*`. */
    lineHeight: {
      "3xs": "0.875rem",
      "2xs": "1rem",
      xs: "1.125rem",
      s: "1.25rem",
      m: "1.375rem",
      l: "1.5rem",
      xl: "1.625rem",
      "2xl": "1.75rem",
      "3xl": "1.875rem",
      "4xl": "2rem",
      "5xl": "2.125rem",
      "6xl": "2.25rem",
      "7xl": "2.5rem",
      "8xl": "3.125rem",
      "9xl": "4rem",
      labelMicro: "1rem",
    },
    /** Начертания (числовые веса шрифта). */
    weight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    /** Межбуквенный интервал (em). */
    letterSpacing: {
      tighter: "-0.02em",
      tight: "-0.01em",
      normal: "0",
      wide: "0.04em",
      wider: "0.06em",
    },
  },
  /** Тени: ось `xs`→`6xl`, усиление с размером. */
  shadow: {
    xs: "0 2px 4px rgba(15, 17, 21, 0.08)",
    s: "0 4px 8px rgba(15, 17, 21, 0.1)",
    m: "0 8px 16px rgba(15, 17, 21, 0.14)",
    l: "0 16px 32px rgba(15, 17, 21, 0.2)",
    xl: "0 24px 48px rgba(15, 17, 21, 0.24)",
    "2xl": "0 32px 64px rgba(15, 17, 21, 0.26)",
    "3xl": "0 40px 80px rgba(15, 17, 21, 0.28)",
    "4xl": "0 48px 96px rgba(15, 17, 21, 0.3)",
    "5xl": "0 56px 112px rgba(15, 17, 21, 0.32)",
    "6xl": "0 64px 128px rgba(15, 17, 21, 0.34)",
  },
  /** Движение: длительности и кривые easing. */
  motion: {
    /** Длительности по смыслу (не ось размеров). */
    duration: {
      fast: "200ms",
      medium: "350ms",
      slow: "500ms",
    },
    /** Кривые сглаживания. */
    easing: {
      standard: "cubic-bezier(0.2, 0, 0, 1)",
    },
  },
  /**
   * Z-index: именованные роли слоёв (не ось размеров). Интервалы с запасом.
   *
   * Глобальная страница: base → sticky → popover → dropdown → tooltip.
   * Блокирующие оболочки: drawer (ниже) → modal (выше). Порталы на `body` внутри drawer/modal
   * используют отдельные уровни (`*InDrawer`, `*InModal`, `*InDrawerInModal`), см. `OverlayPortalLayerContext`.
   *
   * Drawer внутри modal: оболочка `drawerNestedShell` выше `modal`; порталы внутри — ещё выше.
   * Тосты — поверх всех перечисленных слоёв.
   */
  zIndex: {
    base: "10",
    sticky: "100",
    popover: "1000",
    dropdown: "1200",
    tooltip: "1600",
    /** `Drawer`, mobile fullscreen `Sidebar` — ниже модалки. */
    drawer: "2000",
    /** `Modal` (оверлей + диалог), CommandMenu — поверх drawer. */
    modal: "3000",
    popoverInDrawer: "2100",
    dropdownInDrawer: "2200",
    tooltipInDrawer: "2300",
    popoverInModal: "3100",
    dropdownInModal: "3200",
    tooltipInModal: "3300",
    /** Оверлей и панель `Drawer`, открытого поверх `Modal`. */
    drawerNestedShell: "3400",
    popoverInDrawerInModal: "3500",
    dropdownInDrawerInModal: "3600",
    tooltipInDrawerInModal: "3700",
    /** Выше модалок и вложенных порталов — очередь тостов. */
    toast: "10000",
  },
} as const;
