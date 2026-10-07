/**
 * Semantic layer (`--prime-*`). Components read only these variables.
 * Path → variable: `color.bg.canvas` → `--prime-color-bg-canvas`, camelCase → kebab-case.
 * Values below are the light theme; `themes/dark.ts` overrides colors and shadows.
 *
 * Design rules (see docs/foundation.md):
 * - Depth comes from fills, not borders. `border.subtle` is a hairline, `border.control` is transparent
 *   (it becomes visible only under `prefers-contrast: more`).
 * - Every size is on the 4px grid. Controls share one size axis: xs 28 · s 32 · m 36 · l 40 · xl 48.
 * - A nested radius equals the outer radius minus the padding between them.
 */

const hues = ["blue", "green", "orange", "red", "yellow", "purple", "sky", "pink", "teal"] as const;
type Hue = (typeof hues)[number];
const hueRef: Record<Hue, string> = {
  blue: "cobalt",
  green: "green",
  orange: "orange",
  red: "red",
  yellow: "yellow",
  purple: "purple",
  sky: "sky",
  pink: "pink",
  teal: "teal",
};

/** Light palette for Badge / Avatar colors: soft fill + readable text + solid fill. */
function lightPalette() {
  const out: Record<string, { soft: string; text: string; solid: string; solidFg: string }> = {
    gray: {
      /** Translucent: a gray chip stays visible on fields, tiles and tracks. */
      soft: "color-mix(in srgb, var(--prime-ref-color-gray-925) 10%, transparent)",
      text: "{color.gray.700}",
      solid: "{color.gray.600}",
      solidFg: "{color.white}",
    },
  };
  for (const hue of hues) {
    const r = hueRef[hue];
    out[hue] =
      hue === "yellow"
        ? {
            soft: "{color.yellow.100}",
            text: "{color.yellow.800}",
            solid: "{color.yellow.400}",
            solidFg: "{color.gray.925}",
          }
        : {
            soft: `{color.${r}.100}`,
            text: `{color.${r}.700}`,
            solid: `{color.${r}.700}`,
            solidFg: "{color.white}",
          };
  }
  return out;
}

export const semanticTokens = {
  color: {
    bg: {
      /** App background. */
      canvas: "{color.gray.50}",
      /** Cards, panels, table bodies. */
      surface: "{color.gray.0}",
      /** Floating layers: menus, popovers, modals, drawers. */
      raised: "{color.gray.0}",
      /** Inset areas inside a surface: modal footer, table head, code. */
      sunken: "{color.gray.75}",
      inverse: "{color.gray.925}",
      scrim: "rgba(17, 19, 24, 0.44)",
    },
    fill: {
      /** Transparent wash: ghost hover, row hover. Works on any background. */
      subtle: "rgba(17, 19, 24, 0.04)",
      subtleActive: "rgba(17, 19, 24, 0.07)",
      /**
       * Neutral buttons, chips, segmented track. Translucent ink wash: always one step off whatever
       * it sits on (canvas, card, sunken tile, a custom container), in both themes.
       */
      muted: "color-mix(in srgb, var(--prime-ref-color-gray-925) 7%, transparent)",
      mutedHover: "color-mix(in srgb, var(--prime-ref-color-gray-925) 10%, transparent)",
      /** Unchecked checkbox, switch track, slider track. Same wash, stronger. */
      strong: "color-mix(in srgb, var(--prime-ref-color-gray-925) 15%, transparent)",
      strongHover: "color-mix(in srgb, var(--prime-ref-color-gray-925) 22%, transparent)",
    },
    text: {
      primary: "{color.gray.925}",
      secondary: "{color.gray.700}",
      muted: "{color.gray.600}",
      /** gray.600: keeps AA on the field wash over every host, including the canvas. */
      placeholder: "{color.gray.600}",
      disabled: "{color.gray.400}",
      inverse: "{color.gray.0}",
    },
    border: {
      /** Zone separators inside floating layers (dialog header/footer): only just visible. */
      faint: "{color.gray.75}",
      /** Hairline separators: dividers, table rows. Barely visible by design. */
      subtle: "{color.gray.100}",
      /** Stroke-mode buttons and the few places that genuinely need a line. */
      default: "{color.gray.150}",
      /** Control outline. Transparent; `globals.css` turns it on for `prefers-contrast: more`. */
      control: "transparent",
    },
    accent: {
      default: "{color.cobalt.700}",
      hover: "{color.cobalt.800}",
      fg: "{color.white}",
      soft: "{color.cobalt.100}",
      softHover: "{color.cobalt.200}",
      text: "{color.cobalt.700}",
    },
    danger: {
      default: "{color.red.600}",
      hover: "{color.red.700}",
      fg: "{color.white}",
      soft: "{color.red.100}",
      text: "{color.red.700}",
      border: "{color.red.500}",
    },
    success: {
      default: "{color.green.700}",
      fg: "{color.white}",
      soft: "{color.green.100}",
      text: "{color.green.700}",
    },
    warning: {
      default: "{color.orange.700}",
      fg: "{color.white}",
      soft: "{color.orange.100}",
      text: "{color.orange.800}",
    },
    /** Sky, not cobalt: info must read differently from the accent. */
    info: {
      default: "{color.sky.700}",
      fg: "{color.white}",
      soft: "{color.sky.100}",
      text: "{color.sky.800}",
    },
    /**
     * Field fill depends on what it sits on. `bg` is the canvas value; every surface component
     * (Card, Modal, Drawer, Popover, Sidebar…) sets `--prime-color-field-bg: var(--prime-color-field-bg-surface)`.
     */
    field: {
      /** Translucent wash, visible on any background; `bgSurface` kept equal for surface contexts. */
      bg: "color-mix(in srgb, var(--prime-ref-color-gray-925) 6%, transparent)",
      bgSurface: "color-mix(in srgb, var(--prime-ref-color-gray-925) 6%, transparent)",
      bgFocus: "{color.gray.0}",
      bgDisabled: "color-mix(in srgb, var(--prime-ref-color-gray-925) 4%, transparent)",
    },
    /**
     * Card fill depends on what it sits on (same idea as `field`). On the canvas a card is white and raised;
     * every surface plane (AppShell content, Card, Modal, Drawer, Popover) sets
     * `--prime-color-card-bg: var(--prime-color-bg-sunken)`, and a card on a sunken fill drops its shadow.
     */
    card: {
      bg: "{color.bg.surface}",
    },
    focus: {
      ring: "{color.cobalt.700}",
    },
    control: {
      /** Switch thumb, slider thumb. */
      thumb: "{color.white}",
      /** Selected segment in a segmented track: one step lighter than the track. */
      selected: "{color.gray.0}",
    },
    tooltip: {
      bg: "{color.gray.925}",
      text: "{color.gray.0}",
    },
    palette: lightPalette(),
  },

  font: {
    family: {
      sans: "{font.family.sans}",
      mono: "{font.family.mono}",
    },
    weight: {
      regular: "{font.weight.regular}",
      medium: "{font.weight.medium}",
      semibold: "{font.weight.semibold}",
    },
    /** Letter-spacing steps for overriding a role's own tracking (Typography `tracking`). */
    tracking: {
      normal: "{font.tracking.normal}",
      tight: "{font.tracking.tight}",
      tighter: "{font.tracking.tighter}",
      wide: "{font.tracking.wide}",
    },
  },

  /**
   * Type roles. Each role = size / lineHeight / weight / tracking.
   * Big headings get tighter leading and negative tracking; small text gets more air.
   */
  text: {
    caption: {
      size: "{font.size.12}",
      lineHeight: "{font.lineHeight.16}",
      weight: "{font.weight.regular}",
      tracking: "{font.tracking.wide}",
    },
    bodyS: {
      size: "{font.size.13}",
      lineHeight: "{font.lineHeight.20}",
      weight: "{font.weight.regular}",
      tracking: "{font.tracking.normal}",
    },
    bodyM: {
      size: "{font.size.14}",
      lineHeight: "{font.lineHeight.20}",
      weight: "{font.weight.regular}",
      tracking: "{font.tracking.normal}",
    },
    bodyL: {
      size: "{font.size.16}",
      lineHeight: "{font.lineHeight.24}",
      weight: "{font.weight.regular}",
      tracking: "{font.tracking.normal}",
    },
    titleS: {
      size: "{font.size.14}",
      lineHeight: "{font.lineHeight.20}",
      weight: "{font.weight.semibold}",
      tracking: "{font.tracking.normal}",
    },
    titleM: {
      size: "{font.size.16}",
      lineHeight: "{font.lineHeight.24}",
      weight: "{font.weight.semibold}",
      tracking: "{font.tracking.tight}",
    },
    titleL: {
      size: "{font.size.18}",
      lineHeight: "{font.lineHeight.24}",
      weight: "{font.weight.semibold}",
      tracking: "{font.tracking.tight}",
    },
    headingS: {
      size: "{font.size.20}",
      lineHeight: "{font.lineHeight.28}",
      weight: "{font.weight.semibold}",
      tracking: "{font.tracking.tight}",
    },
    headingM: {
      size: "{font.size.24}",
      lineHeight: "{font.lineHeight.32}",
      weight: "{font.weight.semibold}",
      tracking: "{font.tracking.tighter}",
    },
    headingL: {
      size: "{font.size.30}",
      lineHeight: "{font.lineHeight.36}",
      weight: "{font.weight.semibold}",
      tracking: "{font.tracking.tighter}",
    },
    displayS: {
      size: "{font.size.36}",
      lineHeight: "{font.lineHeight.44}",
      weight: "{font.weight.semibold}",
      tracking: "{font.tracking.tighter}",
    },
    displayM: {
      size: "{font.size.48}",
      lineHeight: "{font.lineHeight.56}",
      weight: "{font.weight.semibold}",
      tracking: "{font.tracking.tightest}",
    },
    displayL: {
      size: "{font.size.60}",
      lineHeight: "{font.lineHeight.68}",
      weight: "{font.weight.semibold}",
      tracking: "{font.tracking.tightest}",
    },
    code: {
      size: "{font.size.13}",
      lineHeight: "{font.lineHeight.20}",
      weight: "{font.weight.regular}",
      tracking: "{font.tracking.normal}",
    },
  },

  /** 4px grid; the key is the number of 4px steps. Values outside this scale are not allowed. */
  space: {
    0: "{space.0}",
    1: "{space.1}",
    2: "{space.2}",
    3: "{space.3}",
    4: "{space.4}",
    5: "{space.5}",
    6: "{space.6}",
    7: "{space.7}",
    8: "{space.8}",
    10: "{space.10}",
    12: "{space.12}",
    14: "{space.14}",
    16: "{space.16}",
    20: "{space.20}",
    24: "{space.24}",
  },

  radius: {
    xs: "{radius.4}",
    s: "{radius.6}",
    m: "{radius.8}",
    l: "{radius.12}",
    xl: "{radius.16}",
    full: "{radius.full}",
  },

  icon: {
    xs: "{icon.14}",
    s: "{icon.16}",
    m: "{icon.20}",
    l: "{icon.24}",
    xl: "{icon.32}",
  },

  border: {
    width: "1px",
  },

  focus: {
    width: "2px",
    /** Outer ring for buttons, links, chips, tabs… */
    offset: "2px",
    /** Fields draw the ring inside their edge: it reads as a crisp accent border and can never be clipped. */
    offsetInset: "-2px",
    /** Minimum free space a scroll/overflow container keeps around focusable content (= width + offset). */
    space: "4px",
  },

  shadow: {
    /** Cards on canvas: a whisper, depth mostly comes from the fill. */
    raised: "0 1px 2px rgba(17, 19, 24, 0.04)",
    /** Menus, popovers, tooltips, datepicker. */
    overlay: "0 0 0 1px rgba(17, 19, 24, 0.04), 0 12px 32px -8px rgba(17, 19, 24, 0.18)",
    /** Modals and drawers. */
    modal: "0 0 0 1px rgba(17, 19, 24, 0.04), 0 32px 64px -16px rgba(17, 19, 24, 0.30)",
    /** Slider thumb: one crisp outer edge plus a short contact shadow. */
    thumb: "0 0 0 1px rgba(17, 19, 24, 0.08), 0 1px 3px rgba(17, 19, 24, 0.16)",
  },

  motion: {
    duration: {
      /** Hover fill on dense, high-frequency rows and cells. */
      xfast: "{duration.150}",
      fast: "{duration.230}",
      base: "{duration.380}",
      slow: "{duration.570}",
    },
    easing: {
      standard: "{easing.standard}",
      enter: "{easing.enter}",
      exit: "{easing.exit}",
      /** State that glides into place (thumbs, indicators, checkmarks); pair with `base`. */
      emphasized: "{easing.emphasized}",
    },
    /** Step between items of a staggered first render. */
    stagger: "{duration.80}",
    /** `:active` scale of pressable controls; `compact` for icon-only and small targets. */
    press: {
      scale: "0.98",
      scaleCompact: "0.96",
    },
  },

  z: {
    sticky: "{zIndex.sticky}",
    popover: "{zIndex.popover}",
    dropdown: "{zIndex.dropdown}",
    tooltip: "{zIndex.tooltip}",
    drawer: "{zIndex.drawer}",
    popoverInDrawer: "{zIndex.popoverInDrawer}",
    dropdownInDrawer: "{zIndex.dropdownInDrawer}",
    tooltipInDrawer: "{zIndex.tooltipInDrawer}",
    modal: "{zIndex.modal}",
    popoverInModal: "{zIndex.popoverInModal}",
    dropdownInModal: "{zIndex.dropdownInModal}",
    tooltipInModal: "{zIndex.tooltipInModal}",
    drawerNestedShell: "{zIndex.drawerNestedShell}",
    popoverInDrawerInModal: "{zIndex.popoverInDrawerInModal}",
    dropdownInDrawerInModal: "{zIndex.dropdownInDrawerInModal}",
    tooltipInDrawerInModal: "{zIndex.tooltipInDrawerInModal}",
    toast: "{zIndex.toast}",
  },

  /**
   * Control size tiers shared by Button, Input, Select, Datepicker, Tabs, SegmentedControl, etc.
   * Pairing: a field of tier T uses `labelSize`/`hintSize` of tier T; menus opened from tier T
   * use `itemHeight` of tier T; badges inside tier T use the badge tier one step down.
   * `track` is the line thickness of Slider and ProgressBar; their thumb and gaps derive from it.
   */
  control: {
    xs: {
      height: "{space.7}",
      paddingX: "{space.2}",
      fieldPaddingX: "{space.2}",
      gap: "{space.1}",
      icon: "{icon.14}",
      radius: "{radius.6}",
      textSize: "{font.size.12}",
      lineHeight: "{font.lineHeight.16}",
      labelSize: "{font.size.12}",
      labelLineHeight: "{font.lineHeight.16}",
      hintSize: "{font.size.12}",
      hintLineHeight: "{font.lineHeight.16}",
      labelGap: "{space.1}",
      hintGap: "{space.1}",
      itemHeight: "{space.6}",
      choice: "{icon.14}",
      track: "0.25rem",
    },
    s: {
      height: "{space.8}",
      paddingX: "{space.3}",
      fieldPaddingX: "{space.2}",
      gap: "{space.2}",
      icon: "{icon.16}",
      radius: "{radius.8}",
      textSize: "{font.size.13}",
      lineHeight: "{font.lineHeight.20}",
      labelSize: "{font.size.12}",
      labelLineHeight: "{font.lineHeight.16}",
      hintSize: "{font.size.12}",
      hintLineHeight: "{font.lineHeight.16}",
      labelGap: "{space.1}",
      hintGap: "{space.1}",
      itemHeight: "{space.7}",
      choice: "{icon.16}",
      track: "0.3125rem",
    },
    m: {
      height: "{space.9}",
      paddingX: "{space.4}",
      fieldPaddingX: "{space.3}",
      gap: "{space.2}",
      icon: "{icon.16}",
      radius: "{radius.8}",
      textSize: "{font.size.14}",
      lineHeight: "{font.lineHeight.20}",
      labelSize: "{font.size.13}",
      labelLineHeight: "{font.lineHeight.20}",
      hintSize: "{font.size.12}",
      hintLineHeight: "{font.lineHeight.16}",
      labelGap: "{space.2}",
      hintGap: "{space.1}",
      itemHeight: "{space.8}",
      choice: "1.125rem",
      track: "0.375rem",
    },
    l: {
      height: "{space.10}",
      paddingX: "{space.5}",
      fieldPaddingX: "{space.3}",
      gap: "{space.2}",
      icon: "{icon.20}",
      radius: "{radius.10}",
      textSize: "{font.size.16}",
      lineHeight: "{font.lineHeight.24}",
      labelSize: "{font.size.14}",
      labelLineHeight: "{font.lineHeight.20}",
      hintSize: "{font.size.13}",
      hintLineHeight: "{font.lineHeight.20}",
      labelGap: "{space.2}",
      hintGap: "{space.1}",
      itemHeight: "{space.9}",
      choice: "{icon.20}",
      track: "0.4375rem",
    },
    xl: {
      height: "{space.12}",
      paddingX: "{space.6}",
      fieldPaddingX: "{space.4}",
      gap: "{space.3}",
      icon: "{icon.20}",
      radius: "{radius.12}",
      textSize: "{font.size.16}",
      lineHeight: "{font.lineHeight.24}",
      labelSize: "{font.size.14}",
      labelLineHeight: "{font.lineHeight.20}",
      hintSize: "{font.size.13}",
      hintLineHeight: "{font.lineHeight.20}",
      labelGap: "{space.2}",
      hintGap: "{space.1}",
      itemHeight: "{space.10}",
      choice: "{icon.24}",
      track: "0.5rem",
    },
  },

  /** Badge / Kbd tiers. Inside a control of tier T use the badge tier one step down. */
  badge: {
    xs: {
      height: "1rem",
      paddingX: "{space.1}",
      textSize: "{font.size.12}",
      icon: "0.75rem",
      gap: "{space.1}",
      radius: "{radius.4}",
    },
    s: {
      height: "{space.5}",
      paddingX: "0.375rem",
      textSize: "{font.size.12}",
      icon: "0.75rem",
      gap: "{space.1}",
      radius: "{radius.6}",
    },
    m: {
      height: "{space.6}",
      paddingX: "{space.2}",
      textSize: "{font.size.12}",
      icon: "{icon.14}",
      gap: "{space.1}",
      radius: "{radius.6}",
    },
    l: {
      height: "{space.7}",
      paddingX: "0.625rem",
      textSize: "{font.size.13}",
      icon: "{icon.16}",
      gap: "{space.1}",
      radius: "{radius.8}",
    },
    xl: {
      height: "{space.8}",
      paddingX: "{space.3}",
      textSize: "{font.size.14}",
      icon: "{icon.16}",
      gap: "{space.2}",
      radius: "{radius.8}",
    },
  },

  switch: {
    xs: { width: "{space.6}", height: "1rem", thumb: "0.75rem" },
    s: { width: "{space.7}", height: "1rem", thumb: "0.75rem" },
    m: { width: "{space.8}", height: "{space.5}", thumb: "1rem" },
    l: { width: "{space.9}", height: "{space.5}", thumb: "1rem" },
    xl: { width: "2.75rem", height: "{space.6}", thumb: "{icon.20}" },
  },

  avatar: {
    xs: "{space.5}",
    s: "{space.6}",
    m: "{space.8}",
    l: "{space.10}",
    xl: "{space.12}",
    "2xl": "{space.16}",
  },

  /** Thumbnail tier: height (width follows the aspect ratio) and corner radius. */
  thumbnail: {
    xs: { height: "{space.6}", radius: "{radius.4}" },
    s: { height: "{space.8}", radius: "{radius.6}" },
    m: { height: "{space.10}", radius: "{radius.8}" },
    l: { height: "{space.12}", radius: "{radius.8}" },
    xl: { height: "{space.16}", radius: "{radius.12}" },
  },

  /** Floating panel shared by Select, Dropdown, Combobox, Datepicker, Popover. Item radius = radius − padding. */
  panel: {
    radius: "{radius.12}",
    padding: "{space.1}",
    itemRadius: "{radius.8}",
    itemPaddingX: "{space.2}",
    contentPadding: "{space.4}",
    offset: "{space.1}",
    groupLabelHeight: "{space.7}",
    maxHeight: "20rem",
    minWidth: "12rem",
  },

  card: {
    /** Context: surfaces set it to `none` together with `--prime-color-card-bg` (see color.card). */
    shadow: "{shadow.raised}",
    radius: "{radius.12}",
    paddingS: "{space.4}",
    paddingM: "{space.5}",
    paddingL: "{space.6}",
    gap: "{space.4}",
  },

  modal: {
    radius: "{radius.16}",
    padding: "{space.6}",
    viewportPadding: "{space.4}",
    widthS: "27.5rem",
    widthM: "35rem",
    widthL: "45rem",
    widthXl: "60rem",
  },

  drawer: {
    padding: "{space.6}",
    widthS: "22.5rem",
    widthM: "30rem",
    widthL: "40rem",
    widthXl: "50rem",
  },

  tooltip: {
    radius: "{radius.6}",
    paddingX: "{space.2}",
    paddingY: "{space.1}",
    maxWidth: "17.5rem",
    /** Arrow base and depth; the arrow points at the trigger's centre. */
    arrowWidth: "0.625rem",
    arrowHeight: "0.3125rem",
    /** Gap from the trigger to the chip body (the arrow sits inside it). */
    offset: "{space.2}",
  },

  table: {
    rowHeightS: "{space.9}",
    rowHeightM: "2.75rem",
    rowHeightL: "3.25rem",
    cellPaddingX: "{space.3}",
  },

  layout: {
    sidebarWidth: "15.5rem",
    sidebarCollapsedWidth: "{space.14}",
    gutterS: "{space.4}",
    gutterM: "{space.6}",
    gutterL: "{space.8}",
    contentMaxWidth: "75rem",
    readingMaxWidth: "42rem",
  },
} as const;
