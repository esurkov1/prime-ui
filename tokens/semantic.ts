/**
 * Semantic layer (`--prime-*`). Components read only these variables.
 * Path → variable: `color.text.primary` → `--prime-color-text-primary`, camelCase → kebab-case.
 * Values below are the light theme; `themes/dark.ts` overrides colors and shadows.
 *
 * Design rules (see docs/foundation.md):
 * - Depth comes from fills, not borders. `border.subtle` is a hairline, `border.control` is transparent
 *   (it becomes visible only under `prefers-contrast: more`).
 * - Every size is on the 4px grid (foundation §1 rule 2); the few deliberate exceptions are the
 *   `OFF_GRID` list of `scripts/build-tokens.ts`, which fails the build on any other.
 *   Controls share one size axis: xs 28 · s 32 · m 36 · l 40 · xl 48.
 * - Values are references (`{color.gray.925}`, also inside a `color-mix()` or a shadow), never a
 *   raw color or a `var()`: the build resolves and checks every one.
 * - A nested radius equals the outer radius minus the padding between them.
 * - Surfaces are a ladder (`color.layer`, see `layers.ts`): the page and four nested layers, each one
 *   ΔL step from its parent. Which row applies is the surface's `data-depth`; `globals.css` maps it
 *   to the context variables components read (`--prime-color-layer-current`, `--prime-color-field-bg`,
 *   `--prime-color-fill-muted`, `--prime-color-control-selected`…).
 */
import { hueRef, hues } from "./hues";
import { LIGHT_LAYERS, layerTokens } from "./layers";

export type PaletteRoles = { soft?: string; text: string; solid: string; solidFg: string };

/**
 * Light palette for Badge / Avatar colors: soft fill + readable text + solid fill. Gray has no
 * `soft`: `internal/palette.module.css` washes the text ink (`--prime-tint-soft`) over whatever the
 * chip stands on, so it steps off every layer, field, track and tinted host.
 */
function lightPalette() {
  const out: Record<string, PaletteRoles> = {
    gray: {
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
    /**
     * Surface ladder, computed by `layers.ts`: `0` the page … `4` the deepest nested layer, `floating`
     * for menus, popovers, modals and drawers (`floating1`/`floating2` nest inside it). Each row:
     * `bg` the layer, `fill` controls on it, `fillHover`, `selected` the thumb on its track.
     * Components read them through the depth context variables (globals.css), not directly.
     */
    layer: layerTokens(LIGHT_LAYERS),
    bg: {
      inverse: "{color.gray.925}",
      scrim: "color-mix(in srgb, {color.gray.925} 44%, transparent)",
      /** Soft shade over an edge that hides scrolled content (DataTable columns). */
      edgeShadow: "color-mix(in srgb, {color.gray.925} 14%, transparent)",
      /**
       * Translucent glass over content (floating BottomNav), always with a strong backdrop blur
       * (`--prime-glass-saturation` lifts the colors under it): dense, as the iOS tab bar — the
       * content shows through as soft shapes.
       */
      glass: "color-mix(in srgb, {color.white} 72%, transparent)",
      /** The light that catches on the rim of a glass surface: the line that makes it read as glass. */
      glassEdge: "color-mix(in srgb, {color.white} 85%, transparent)",
      /** Glass made opaque, where the person asked for less transparency: the floating layer's fill. */
      glassSolid: "{color.layer.floating.bg}",
    },
    /**
     * Over a photo the picture is the ground, not the theme: one look in both themes. `shade` sits
     * under small text and controls (an index, a delete button).
     * `pill` sits under a caption over a video (a duration, a message's time and ticks): denser
     * than `shade`, so `pillFg` — the muted tone of a caption, not bold white — keeps AA over a
     * white frame.
     */
    media: {
      shade: "color-mix(in srgb, {color.gray.925} 56%, transparent)",
      shadeFg: "{color.white}",
      /**
       * A round disk over media (play, cancel, retry, download — Button `shade`, the play mark):
       * lighter than `shade` under a softer blur, so the frame shows through; its white glyph
       * keeps 3:1 (a graphical object) even over a white frame. Pills keep `shade` / `pill`:
       * they carry text, which needs the denser ground.
       */
      disk: "color-mix(in srgb, {color.gray.925} 48%, transparent)",
      pill: "color-mix(in srgb, {color.gray.925} 72%, transparent)",
      pillFg: "color-mix(in srgb, {color.white} 80%, transparent)",
      /** The ground of a full-screen media viewer: near black, so any picture reads at its truest. */
      stage: "{color.gray.950}",
    },
    /**
     * Translucent state washes: they sit on any background, including ones off the ladder (an
     * image, a tinted banner). Resting fills of controls come from the ladder instead
     * (`--prime-color-fill-muted`, `--prime-color-field-bg`).
     */
    fill: {
      /** Ghost hover, row hover. */
      subtle: "color-mix(in srgb, {color.gray.925} 4%, transparent)",
      subtleActive: "color-mix(in srgb, {color.gray.925} 7%, transparent)",
      /** The faintest wash: hover of a tab in the tab strip, below the selected tab's step. */
      faint: "color-mix(in srgb, {color.gray.925} 4%, transparent)",
      /** Unchecked checkbox, switch track, slider track. */
      strong: "color-mix(in srgb, {color.gray.925} 15%, transparent)",
      strongHover: "color-mix(in srgb, {color.gray.925} 22%, transparent)",
    },
    /**
     * Dark ink for a mark on a light color that is not a theme surface (the check on a light
     * swatch, text on a yellow solid): one value in both themes.
     */
    inkOnLight: "{color.gray.925}",
    text: {
      primary: "{color.gray.925}",
      secondary: "{color.gray.700}",
      muted: "{color.gray.600}",
      /** gray.600: keeps AA on the field wash over every host, including the canvas. */
      placeholder: "{color.gray.600}",
      disabled: "{color.gray.400}",
      inverse: "{color.white}",
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
      hover: "{color.green.800}",
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
    /** The field fill at rest, hover and focus comes from the ladder (`--prime-color-field-bg*`). */
    field: {
      /** A disabled field: a faint wash on whatever it sits on. */
      bgDisabled: "color-mix(in srgb, {color.gray.925} 4%, transparent)",
    },
    focus: {
      ring: "{color.cobalt.700}",
    },
    control: {
      /** Switch thumb, slider thumb. */
      thumb: "{color.white}",
    },
    /**
     * The tooltip is an inverse chip: everything inside it (a Kbd, a secondary line) reads its
     * colors from here, through the context the chip sets (`--prime-color-text-*`, fills).
     */
    tooltip: {
      bg: "{color.gray.925}",
      text: "{color.white}",
      /** Secondary text on the chip (a shortcut, a second line). */
      muted: "{color.gray.300}",
      /** A key cap or chip on the chip: a light wash over the dark fill. */
      fill: "color-mix(in srgb, {color.white} 14%, transparent)",
    },
    palette: lightPalette(),
    /**
     * Chat bubbles (`Message`). An incoming bubble is a surface on the ladder (one step off its
     * host); an outgoing one is a tinted host off the ladder in the accent hue, and everything inside
     * it (meta, links, reply bar, waveform, reactions, players) reads these roles through the
     * variables the bubble sets. `muted` keeps AA on `bg`; `accent` draws links, the reply bar and
     * the played waveform, `accentFg` the glyph on an accent disk; `fill` / `fillHover` are inner
     * tiles (reply, link preview), `track` the unplayed waveform, `chip` / `chipHover` a reaction
     * chip that is not the reader's (neutral, not tinted).
     */
    message: {
      outgoing: {
        bg: "{color.cobalt.100}",
        text: "{color.gray.925}",
        muted: "{color.gray.600}",
        accent: "{color.cobalt.700}",
        accentFg: "{color.white}",
        /** A failed send, a failed upload: AA on `bg`. */
        danger: "{color.red.700}",
        fill: "color-mix(in srgb, {color.cobalt.700} 10%, transparent)",
        fillHover: "color-mix(in srgb, {color.cobalt.700} 16%, transparent)",
        track: "color-mix(in srgb, {color.cobalt.700} 28%, transparent)",
        /**
         * A reaction chip that is not the reader's: a neutral dark wash over `bg`, precomposed
         * (opaque), so the ring of its avatars matches it.
         */
        chip: "color-mix(in srgb, {color.gray.925} 8%, {color.cobalt.100})",
        chipHover: "color-mix(in srgb, {color.gray.925} 12%, {color.cobalt.100})",
      },
    },
    /**
     * Data visualisation (foundation §3, SKILL/foundations.md «Charts»). Categories wear these,
     * statuses wear the tones.
     * - `1`…`8`: categorical series in one fixed order — blue, orange, teal, yellow, pink, green,
     *   purple, red; each keeps 3:1 on every layer ground of its theme (`chartColors.test.ts`).
     *   Assign in order, never cycle; a ninth series folds into `other`. Palette hues
     *   (`color` props) map onto the same steps (`--hue-chart`), so a category keeps its color in a
     *   chart and in a ProgressBar share.
     * - `other`: the «Прочее» share. `grid`: gridlines. `axis`: the axis line and ticks (axis
     *   labels wear text tokens).
     * - `scale.1`…`scale.5`: sequential magnitude (heatmap cells), one hue from near the ground to
     *   full; `scaleFg` is the text on steps 4–5 (steps 1–3 take `text.primary`).
     */
    chart: {
      1: "{color.cobalt.600}",
      2: "{color.chart.light.orange}",
      3: "{color.chart.light.teal}",
      4: "{color.chart.light.yellow}",
      5: "{color.chart.light.pink}",
      6: "{color.chart.light.green}",
      7: "{color.chart.light.purple}",
      8: "{color.chart.light.red}",
      other: "{color.gray.400}",
      grid: "{color.gray.100}",
      axis: "{color.gray.300}",
      scale: {
        1: "{color.cobalt.100}",
        2: "{color.cobalt.200}",
        3: "{color.cobalt.300}",
        4: "{color.cobalt.600}",
        5: "{color.cobalt.800}",
      },
      scaleFg: "{color.white}",
    },
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
    /**
     * The one amplitude of an icon gesture (`src/icons/glyphMotion.module.css`): a step in the
     * glyph's own 24-unit drawing, so it reads the same at every icon size.
     */
    gestureShift: "4px",
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
    raised: "0 1px 2px color-mix(in srgb, {color.gray.925} 4%, transparent)",
    /** Menus, popovers, tooltips, datepicker. */
    overlay:
      "0 0 0 1px color-mix(in srgb, {color.gray.925} 4%, transparent), 0 12px 32px -8px color-mix(in srgb, {color.gray.925} 18%, transparent)",
    /** Modals and drawers. */
    modal:
      "0 0 0 1px color-mix(in srgb, {color.gray.925} 4%, transparent), 0 32px 64px -16px color-mix(in srgb, {color.gray.925} 30%, transparent)",
    /** Slider thumb: one crisp outer edge plus a short contact shadow. */
    thumb:
      "0 0 0 1px color-mix(in srgb, {color.gray.925} 8%, transparent), 0 1px 3px color-mix(in srgb, {color.gray.925} 16%, transparent)",
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
    /**
     * Period unit of a loading loop (Spinner turns once in 3 units, 6 under reduced motion). A
     * loading cue is information, like a gesture clock: globals.css does not zero it.
     */
    loop: "{duration.570}",
    /** Blur that hides a change of shape while two states swap in place (icon → check, letters). */
    blur: "2px",
    /** `:active` scale of pressable controls; `compact` for icon-only and small targets. */
    press: {
      scale: "0.98",
      scaleCompact: "0.96",
    },
    /**
     * Scale magnitudes. Below 1, where a part starts as it enters (and ends as it leaves);
     * above 1, how far a part grows.
     * - `mark`: a glyph or a dot drawn in place (a check, a swapped icon, a radio dot).
     * - `pop`: a small part that pops in (a reaction, a button that appears in a row).
     * - `settle`: a tile part or a disk that settles into place.
     * - `enter`: a block entering in place (a bar, a bubble) — foundation §7 rule 7.
     * - `lift`: a picked-up item (a drag source).
     * - `hover`: a small target under a fine pointer (a swatch, a slider thumb).
     * - `emphasis`: a glyph a pointer or focus singles out (a reaction).
     * - `grab`: a thumb held by the pointer.
     * - `burst`: the peak of a one-shot pick (a reaction chosen).
     * - `pulse`: a ring that spreads out of a live mark and fades.
     */
    scale: {
      mark: "0.6",
      pop: "0.8",
      settle: "0.9",
      enter: "0.96",
      lift: "1.02",
      hover: "1.1",
      emphasis: "1.2",
      grab: "1.25",
      burst: "1.4",
      pulse: "2",
    },
    /**
     * Fades and color changes (`opacity`, `color`, `background-color`, `box-shadow`…): the same
     * clock as `duration`, but reduced motion keeps it (foundation §7 rule 12: movement may go,
     * opacity and color feedback stay). Movement — `transform`, the height glide — takes `duration`.
     */
    fade: {
      xfast: "{duration.150}",
      fast: "{duration.230}",
      base: "{duration.380}",
      slow: "{duration.570}",
    },
    /**
     * How long a hold-to-confirm press lasts (Button `holdToConfirm`): a gesture time, not motion,
     * so reduced motion keeps it.
     */
    holdConfirm: "{duration.1200}",
    /**
     * A clock stopped: the value `globals.css` gives the movement clocks under reduced motion and
     * every clock while a theme switches.
     */
    instant: "{duration.0}",
    /**
     * A clock that never runs out in a session: the browser's autofill paint of a field is pushed
     * out of reach with it (`controls.css`). Not motion, so nothing zeroes it.
     */
    never: "{duration.never}",
  },

  /**
   * Stacking. `sticky`, `overlay` and `toast` are the page levels. The rest are local steps, in
   * rising order, for the parts stacked inside one component; they never compete with the page.
   * `below` a part drawn under its host's content, `base` the content's own level, then `raised`,
   * `above`, `top`, `cover` and `front` for each part laid over the last: a hover wash or a handle
   * is `raised`; the marks over a picture (play, duration, check) are `top`; a control spread over
   * those marks is `cover`; a transfer in front of a whole tile is `front`. A component with sticky
   * parts names them from the same steps (DataTable: first column, group row, header, corner).
   */
  z: {
    below: "{zIndex.below}",
    base: "{zIndex.0}",
    raised: "{zIndex.1}",
    above: "{zIndex.2}",
    top: "{zIndex.3}",
    cover: "{zIndex.4}",
    front: "{zIndex.5}",
    sticky: "{zIndex.sticky}",
    overlay: "{zIndex.overlay}",
    toast: "{zIndex.toast}",
  },

  /**
   * Opacity of content that steps back while it stays in place.
   * - `busy`: a change in flight (a save, a check, a reorder), a picture under a transfer, a target
   *   that is full; the content quiets down and comes back when the answer arrives.
   * - `disabled`: a color sample that cannot wear the disabled text color (a swatch).
   * - `ghost`: the copy a drag source leaves at its place.
   * - `dim`: content that steps back while the screen points at another (a chat's selection, its
   *   current search match, the blink of a jump).
   */
  opacity: {
    busy: "0.6",
    disabled: "0.5",
    ghost: "0.4",
    dim: "0.42",
  },

  /**
   * Tint ladder: how much of a hue a wash takes (`color-mix(in srgb, <hue> var(--prime-tint-*),
   * transparent)`). `faint` a whisper, `soft` a resting chip or selection, `hover` its hover,
   * `active` its press or a selected chip, `line` a track or a ring, `strong` a fill that must read
   * over pictures, `heavy` a near-solid edge.
   */
  tint: {
    faint: "8%",
    soft: "12%",
    hover: "18%",
    active: "24%",
    line: "32%",
    strong: "48%",
    heavy: "72%",
  },

  /**
   * Glass (`color.bg.glass`): how much the backdrop filter lifts the colors seen through it, and
   * the blur behind it — strong, as the iOS tab bar: the page shows only as soft shapes.
   */
  glass: {
    saturation: "1.8",
    blur: "0.875rem",
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
    /**
     * Coarse pointers (`@media (pointer: coarse)`): the hit area of a control below this size grows
     * to it (WCAG 2.5.5); the visual size stays the tier's.
     */
    touchTarget: "2.75rem",
    /** Touch screens and narrow viewports: the least text size of an editable value (iOS zoom). */
    touchTextSize: "{font.size.16}",
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

  /**
   * A media album (`Gallery`, the pictures of a message): the size cap of its box — an album is at
   * most this wide, a lone portrait this tall — the narrowest it stands over a caption, and the gap
   * between its tiles.
   */
  gallery: {
    maxSize: "22.5rem",
    /** The narrowest a gallery stands above a caption: a lone portrait widens to it (cover). */
    minSize: "16rem",
    gap: "2px",
  },

  /**
   * A round disk over media (`--prime-color-media-disk`): the backdrop blur behind it — gentle,
   * so the frame under the disk stays recognisable.
   */
  mediaDisk: {
    blur: "{space.1}",
  },

  /**
   * A shade over media that carries text (`--prime-color-media-shade` / `-pill`: a pill, a bar, a
   * caption over a picture): the backdrop blur behind it — denser than the disk's, so the text
   * keeps its ground over any frame.
   */
  mediaShade: {
    blur: "{space.2}",
  },

  /**
   * The full-screen media viewer (`MediaViewer`): the gap between two pages while one slides into
   * the other, and the inset of its bars from the screen edges (the safe areas are added on top).
   */
  mediaViewer: {
    pageGap: "{space.6}",
    inset: "{space.4}",
    /** The widest the caption and the video control bar stand. */
    barWidth: "40rem",
  },

  /**
   * Chat bubble geometry (`Message`): the corner radius (one on every corner of every bubble), the
   * padding, the gap inside a group of one author and between groups, the width cap of a bubble.
   * Its pictures are capped by `gallery.maxSize`.
   */
  message: {
    radius: "{radius.14}",
    paddingX: "{space.3}",
    paddingY: "{space.2}",
    groupGap: "{space.2}",
    gap: "{space.4}",
    maxWidth: "30rem",
    /** The content width of a card in a bubble (file, contact, location): one width for all. */
    cardWidth: "16rem",
    /** The round video a person is recording (the Composer preview). */
    videoNote: "14.5rem",
    /** The box of a sent round video message (`VideoNote`): its diameter, at most the row. */
    videoNoteBox: "16.75rem",
    /**
     * A message changing size (a reaction row, a transcript that opens): the bubble's box, its
     * parts and the messages around glide in one calm stroke, between `fast` and `base`; zeroed
     * under reduced motion with the other durations.
     */
    morphDuration: "{duration.300}",
    /**
     * Messages that step back (the unselected ones in selection mode, the others while the chat
     * keeps a search match current) take `opacity.dim` and this slight desaturation; the message
     * pointed at or selected stays at full strength.
     */
    dimSaturation: "0.6",
    /**
     * The tail of the last bubble of a run: a curl out of its square bottom corner on the author's
     * side, drawn with the bubble's own fill through `tailMask` (the incoming shape, pointing to
     * the start; outgoing mirrors it). Rows reserve `tailWidth` on the author's side.
     */
    tailWidth: "{space.2}",
    tailHeight: "{space.4}",
    tailMask:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 16' preserveAspectRatio='none'%3E%3Cpath d='M8 0C8 7 6.5 12.5 0.6 15.3C0.2 15.5 0.3 16 0.8 16H8Z'/%3E%3C/svg%3E\")",
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
    /** A dialog of one or two fields. */
    widthXs: "22.5rem",
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

  /** Bottom sheets: Sheet, and Modal and floating layers on a narrow viewport. */
  sheet: {
    /** Side padding of the Sheet zones. */
    padding: "{space.6}",
    radius: "{radius.16}",
    /** The grab bar at the top edge and the strip that holds it. */
    handleWidth: "2.25rem",
    handleHeight: "{space.1}",
    handleArea: "{space.5}",
    /** Room kept above a sheet so the page behind stays visible. */
    topGap: "{space.10}",
    /** A Sheet on a tablet or desktop: centred at this width (= Modal m); full width on a phone. */
    width: "35rem",
  },

  bottomNav: {
    /** Bar height without the safe-area inset: icon 20 + gap 4 + label 12 and air around them. */
    height: "3.25rem",
    /** An icon-only flat bar: no label row, so it is lower. */
    iconOnlyHeight: "{space.12}",
    paddingX: "{space.2}",
    /** Between the icon and the label. */
    itemGap: "{space.1}",
    /** The box that holds the icon and anchors the count. */
    glyphWidth: "{space.7}",
    glyphHeight: "{space.5}",
    /** A light icon (20) over a small label (10, as the iOS tab bar): the bar stays quiet. */
    iconSize: "{icon.20}",
    labelSize: "{font.size.10}",
    labelLineHeight: "{font.lineHeight.12}",
    /**
     * Floating capsule, the iOS 26 tab bar three quarters its size: 46 high (40 icons only), items
     * inset 4, so the selection capsule sits clear of the rim; an 18 glyph over a 9 label, 2
     * apart, with air above and below.
     */
    floatingHeight: "2.875rem",
    floatingIconOnlyHeight: "2.5rem",
    floatingIconSize: "1.125rem",
    floatingLabelSize: "0.5625rem",
    floatingLabelLineHeight: "0.6875rem",
    floatingItemGap: "0.125rem",
    floatingPadding: "{space.1}",
    /** Between the capsule and a round `BottomNav.Action` beside it. */
    floatingGap: "{space.2}",
    /**
     * Floating: the capsule's gap from the screen edges and the blur behind it — strong, as the
     * iOS tab bar: the page under the glass shows only as soft shapes.
     */
    floatingInset: "{space.3}",
    blur: "{glass.blur}",
  },

  /**
   * Tooltip tiers: a chip of tier T is as tall as a menu item of tier T (24 · 28 · 32 · 36 · 40),
   * and text, padding and radius grow together, one step per tier.
   */
  tooltip: {
    xs: {
      textSize: "{font.size.12}",
      lineHeight: "{font.lineHeight.16}",
      paddingX: "0.375rem",
      paddingY: "{space.1}",
      radius: "{radius.4}",
    },
    s: {
      textSize: "{font.size.12}",
      lineHeight: "{font.lineHeight.16}",
      paddingX: "{space.2}",
      paddingY: "0.375rem",
      radius: "{radius.6}",
    },
    m: {
      textSize: "{font.size.13}",
      lineHeight: "{font.lineHeight.20}",
      paddingX: "0.625rem",
      paddingY: "0.375rem",
      radius: "{radius.6}",
    },
    l: {
      textSize: "{font.size.14}",
      lineHeight: "{font.lineHeight.20}",
      paddingX: "{space.3}",
      paddingY: "{space.2}",
      radius: "{radius.8}",
    },
    xl: {
      textSize: "{font.size.16}",
      lineHeight: "{font.lineHeight.24}",
      paddingX: "{space.4}",
      paddingY: "{space.2}",
      radius: "{radius.8}",
    },
    maxWidth: "17.5rem",
    /** Arrow base and depth; the arrow points at the trigger's centre. */
    arrowWidth: "0.625rem",
    arrowHeight: "0.3125rem",
    /** Gap from the trigger to the chip body (the arrow sits inside it). */
    offset: "{space.2}",
  },

  /**
   * DataTable rows: the minimum row height per table `size` (public, so a skeleton or a matrix
   * outside the table can stand in its geometry) and the cell padding.
   */
  table: {
    rowHeightXs: "{space.9}",
    rowHeightS: "{space.9}",
    rowHeightM: "2.75rem",
    rowHeightL: "3.25rem",
    rowHeightXl: "3.25rem",
    cellPaddingX: "{space.3}",
  },

  /**
   * Page frame and content widths. The gutters are the side air of the page per viewport step;
   * `globals.css` publishes the one that applies as `--prime-layout-gutter`.
   * Content widths, for a block that holds its own width (a form, a column, a preview):
   * - `tileMinWidth`: the narrowest column of an auto-fit grid of tiles.
   * - `minWidth`: the narrowest screen the kit supports (320): a block that must fit everywhere.
   * - `narrowWidth`: a phone-wide column (a feed, a list beside a pane).
   * - `formWidthS` / `formWidthM`: a form of a few short fields / of wider fields.
   */
  layout: {
    sidebarWidth: "15.5rem",
    sidebarCollapsedWidth: "{space.14}",
    gutterS: "{space.4}",
    gutterM: "{space.6}",
    gutterL: "{space.8}",
    contentMaxWidth: "75rem",
    readingMaxWidth: "42rem",
    tileMinWidth: "12rem",
    minWidth: "20rem",
    narrowWidth: "22.5rem",
    formWidthS: "27.5rem",
    formWidthM: "35rem",
  },
} as const;
