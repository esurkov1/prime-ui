/**
 * Primitive layer (`--prime-ref-*`). Raw values only: no meaning, never used by components directly.
 * Everything that has a role lives in `semantic.ts`. A step exists only while a semantic token (or a
 * JS consumer such as the ColorPresets defaults) uses it.
 */
export const primitiveTokens = {
  color: {
    white: "#ffffff",
    /** Graphite: cool neutral, slight blue bias. 0–100 light surfaces, 750–950 dark surfaces. */
    gray: {
      0: "#ffffff",
      50: "#f3f4f6",
      75: "#eef0f3",
      100: "#e8eaee",
      150: "#e0e3e8",
      300: "#b9bec8",
      400: "#949bab",
      500: "#636a79",
      600: "#575e6d",
      700: "#3b4150",
      750: "#343a44",
      800: "#2a2f38",
      850: "#20242b",
      875: "#1b1e25",
      900: "#16191f",
      925: "#111318",
      950: "#0d0f13",
    },
    /** Cobalt: brand accent. */
    cobalt: {
      100: "#e6eafd",
      200: "#cdd5fb",
      300: "#aab6ff",
      400: "#93a3ff",
      500: "#5068f5",
      600: "#3f59f0",
      700: "#2f4ae0",
      800: "#2540c8",
      950: "#1b2249",
    },
    red: {
      100: "#fee2e2",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
    },
    orange: {
      100: "#ffedd5",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      700: "#c2410c",
      800: "#9a3412",
    },
    yellow: {
      100: "#fef9c3",
      300: "#fde047",
      400: "#facc15",
      500: "#eab308",
      700: "#a16207",
      800: "#854d0e",
    },
    green: {
      100: "#dcfce7",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      700: "#15803d",
    },
    teal: {
      100: "#ccfbf1",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      700: "#0f766e",
    },
    sky: {
      100: "#e0f2fe",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      700: "#0369a1",
      800: "#075985",
    },
    purple: {
      100: "#f3e8ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      700: "#7e22ce",
    },
    pink: {
      100: "#fce7f3",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      700: "#be185d",
    },
  },

  /** 4px grid. Key = number of 4px steps (`4` → 16px). */
  space: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
  },

  radius: {
    4: "4px",
    6: "6px",
    8: "8px",
    10: "10px",
    12: "12px",
    16: "16px",
    full: "9999px",
  },

  font: {
    family: {
      sans: '"Golos Text", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    },
    /** Modular scale, ~1.2 in the body range, ~1.25 for headings. */
    size: {
      /** Only for tab-bar labels under an icon (BottomNav, iOS tab bar 10pt); text roles start at 12. */
      10: "0.625rem",
      12: "0.75rem",
      13: "0.8125rem",
      14: "0.875rem",
      16: "1rem",
      18: "1.125rem",
      20: "1.25rem",
      24: "1.5rem",
      30: "1.875rem",
      36: "2.25rem",
      48: "3rem",
      60: "3.75rem",
    },
    lineHeight: {
      /** Only for tab-bar labels (BottomNav). */
      12: "0.75rem",
      16: "1rem",
      20: "1.25rem",
      24: "1.5rem",
      28: "1.75rem",
      32: "2rem",
      36: "2.25rem",
      44: "2.75rem",
      56: "3.5rem",
      68: "4.25rem",
    },
    weight: {
      regular: "400",
      medium: "500",
      semibold: "600",
    },
    tracking: {
      tightest: "-0.03em",
      tighter: "-0.02em",
      tight: "-0.01em",
      normal: "0",
      wide: "0.01em",
    },
  },

  icon: {
    14: "0.875rem",
    16: "1rem",
    20: "1.25rem",
    24: "1.5rem",
    32: "2rem",
  },

  duration: {
    80: "80ms",
    150: "150ms",
    230: "230ms",
    380: "380ms",
    570: "570ms",
  },
  easing: {
    /**
     * Ease-in-out (foundation §7): something already on screen moves evenly — no near-instant
     * start and long crawl, so linked parts (a rail and its labels) read as one motion.
     */
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    enter: "cubic-bezier(0, 0, 0, 1)",
    /** Strong ease-out: a leaving element responds at once and is gone fast (no ease-in in UI). */
    exit: "cubic-bezier(0.23, 1, 0.32, 1)",
    /** iOS sheet curve: decisive start, long soft landing, never past the target. */
    emphasized: "cubic-bezier(0.32, 0.72, 0, 1)",
  },

  /**
   * Stacking order. Every overlay (modal, drawer, popover, menu, listbox, tooltip) portals to
   * `<body>` when it opens and shares one level: the DOM order is the open order, so a layer opened
   * later — a Select inside a Modal, a Tooltip inside a Popover — is on top without its own number.
   */
  zIndex: {
    sticky: "100",
    overlay: "1000",
    toast: "10000",
  },
} as const;
