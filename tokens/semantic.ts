/**
 * Семантика: нейтральные поверхности — `color.gray.0` (бумага); литеральный светлый текст на тёмном — `color.white`;
 * акцентный «чёрный» — `color.black`. См. план §3.1.
 */
export const semanticTokens = {
  color: {
    surface: {
      default: "{color.gray.50}",
      raised: "{color.gray.0}",
      elevated: "{color.gray.0}",
      overlay: "{color.overlay.scrimLight}",
      accentSoft: "{color.gray.100}",
      dangerSoft: "{color.red.50}",
    },
    content: {
      primary: "{color.gray.950}",
      secondary: "{color.gray.600}",
      muted: "{color.gray.500}",
      disabled: "{color.gray.400}",
      inverse: "{color.white}",
      accent: "{color.gray.800}",
      danger: "{color.red.800}",
    },
    border: {
      subtle: "{color.gray.200}",
      separator: "{color.gray.300}",
      strong: "{color.gray.300}",
      emphasis: "{color.gray.950}",
      muted: "{color.gray.200}",
      accent: "{color.gray.400}",
      danger: "{color.red.400}",
      disabled: "{color.gray.100}",
      inverse: "{color.white}",
    },
    status: {
      information: {
        background: "{color.blue.50}",
        backgroundEmphasis: "{color.blue.600}",
        foreground: "{color.blue.900}",
        border: "{color.blue.200}",
      },
      warning: {
        background: "{color.orange.50}",
        backgroundEmphasis: "{color.orange.600}",
        foreground: "{color.orange.900}",
        border: "{color.orange.200}",
      },
      success: {
        background: "{color.green.50}",
        backgroundEmphasis: "{color.green.600}",
        foreground: "{color.green.900}",
        border: "{color.green.200}",
      },
      away: {
        background: "{color.yellow.50}",
        backgroundEmphasis: "{color.yellow.600}",
        foreground: "{color.yellow.900}",
        border: "{color.yellow.200}",
      },
      feature: {
        background: "{color.purple.50}",
        backgroundEmphasis: "{color.purple.600}",
        foreground: "{color.purple.900}",
        border: "{color.purple.200}",
      },
      verified: {
        background: "{color.sky.50}",
        backgroundEmphasis: "{color.sky.600}",
        foreground: "{color.sky.900}",
        border: "{color.sky.200}",
      },
      error: {
        background: "{color.red.50}",
        backgroundEmphasis: "{color.red.600}",
        foreground: "{color.red.900}",
        border: "{color.red.200}",
      },
    },
    focus: {
      ring: "{color.gray.950}",
    },
    action: {
      primaryBackground: "{color.gray.950}",
      primaryBackgroundHover: "{color.gray.800}",
      primaryForeground: "{color.white}",
      primarySoftBackground: "{color.gray.100}",
      primarySoftForeground: "{color.gray.950}",
      neutralBackground: "{color.gray.50}",
      neutralBackgroundHover: "{color.gray.100}",
      neutralForeground: "{color.gray.600}",
      errorBackground: "{color.red.600}",
      errorBackgroundHover: "{color.red.700}",
      errorForeground: "{color.white}",
    },
    field: {
      bg: "{color.gray.50}",
      text: "{color.gray.950}",
      placeholder: "{color.gray.400}",
      border: "{color.gray.200}",
      borderHover: "{color.gray.300}",
      borderFocus: "{color.gray.800}",
      borderError: "{color.red.500}",
    },
    tooltip: {
      background: "{color.gray.900}",
      foreground: "{color.white}",
      border: "{color.gray.700}",
    },
    /** Бейдж: серый filled + палитры pink/teal без прямых `--prime-ref-*` в CSS компонента. */
    badge: {
      grayFilled: {
        background: "{color.gray.600}",
      },
      pink: {
        backgroundSoft: "{color.pink.50}",
        foregroundOnSoft: "{color.pink.700}",
        backgroundEmphasis: "{color.pink.500}",
        border: "{color.pink.300}",
      },
      teal: {
        backgroundSoft: "{color.teal.50}",
        foregroundOnSoft: "{color.teal.700}",
        backgroundEmphasis: "{color.teal.500}",
        border: "{color.teal.300}",
      },
    },
    /**
     * Разделители ячеек таблицы: смешение с `border-subtle` (тема задаёт процент в light/dark).
     */
    dataTable: {
      dividerVertical: "color-mix(in srgb, var(--prime-sys-color-border-subtle) 72%, transparent)",
      dividerHorizontal:
        "color-mix(in srgb, var(--prime-sys-color-border-subtle) 82%, transparent)",
      headBackground: "{color.surface.default}",
      rowBackground: "{color.surface.elevated}",
    },
  },
  typography: {
    family: {
      base: "{font.family.base}",
    },
    body: {
      size: "{font.size.s}",
      lineHeight: "{typography.lineHeight.normal}",
      letterSpacing: "{font.letterSpacing.normal}",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.65",
    },
    control: {
      s: "{font.size.xs}",
      m: "{font.size.s}",
      l: "{font.size.m}",
    },
    support: {
      "3xs": "{font.size.3xs}",
      "2xs": "{font.size.2xs}",
      xs: "{font.size.xs}",
      s: "{font.size.s}",
    },
    weight: {
      regular: "{font.weight.regular}",
      medium: "{font.weight.medium}",
      semibold: "{font.weight.semibold}",
      bold: "{font.weight.bold}",
    },
    style: {
      normal: "normal",
      italic: "italic",
    },
    title: {
      size: "{font.size.l}",
      weight: "{font.weight.semibold}",
    },
    sizeScale: {
      "3xs": "{font.size.3xs}",
      "2xs": "{font.size.2xs}",
      xs: "{font.size.xs}",
      s: "{font.size.s}",
      m: "{font.size.m}",
      l: "{font.size.l}",
      xl: "{font.size.xl}",
      "2xl": "{font.size.2xl}",
      "3xl": "{font.size.3xl}",
      "4xl": "{font.size.4xl}",
      "5xl": "{font.size.5xl}",
      "6xl": "{font.size.6xl}",
      "7xl": "{font.size.7xl}",
      "8xl": "{font.size.8xl}",
      "9xl": "{font.size.9xl}",
      labelMicro: "{font.size.labelMicro}",
    },
    lineHeightScale: {
      "3xs": "{font.lineHeight.3xs}",
      "2xs": "{font.lineHeight.2xs}",
      xs: "{font.lineHeight.xs}",
      s: "{font.lineHeight.s}",
      m: "{font.lineHeight.m}",
      l: "{font.lineHeight.l}",
      xl: "{font.lineHeight.xl}",
      "2xl": "{font.lineHeight.2xl}",
      "3xl": "{font.lineHeight.3xl}",
      "4xl": "{font.lineHeight.4xl}",
      "5xl": "{font.lineHeight.5xl}",
      "6xl": "{font.lineHeight.6xl}",
      "7xl": "{font.lineHeight.7xl}",
      "8xl": "{font.lineHeight.8xl}",
      "9xl": "{font.lineHeight.9xl}",
      labelMicro: "{font.lineHeight.labelMicro}",
    },
    tracking: {
      tighter: "{font.letterSpacing.tighter}",
      tight: "{font.letterSpacing.tight}",
      normal: "{font.letterSpacing.normal}",
      wide: "{font.letterSpacing.wide}",
      wider: "{font.letterSpacing.wider}",
    },
    /**
     * Семантические роли чтения (Typography `variant`): пары `fontSize` / `lineHeight` согласованы
     * по смыслу с [Material Design 3 type scale](https://m3.material.io/styles/typography/type-scale-tokens)
     * (Display / Headline / Title / Body / Label), [Polaris Text](https://polaris.shopify.com/components/typography/text)
     * и уровнями текста [Apple HIG — Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
     * (Large Title … Caption). Кегли — в `font.size.*`; ниже — ссылки на ступени `sizeScale`.
     */
    role: {
      /** MD3 Display Large (57/45); Polaris `heading3xl`; Apple Large Title */
      display: {
        fontSize: "{typography.sizeScale.9xl}",
        lineHeight: "{typography.lineHeightScale.9xl}",
      },
      /** MD3 Headline Large (32/40); Polaris `heading2xl`; Apple Title 1 */
      headline: {
        fontSize: "{typography.sizeScale.6xl}",
        lineHeight: "{typography.lineHeightScale.6xl}",
      },
      /** MD3 Headline Medium (28/36); Polaris `headingXl`; Apple Title 2 */
      headingPage: {
        fontSize: "{typography.sizeScale.4xl}",
        lineHeight: "{typography.lineHeightScale.4xl}",
      },
      /** MD3 Headline Small (24/32); Polaris `headingLg`; Apple Title 3 */
      headingSection: {
        fontSize: "{typography.sizeScale.2xl}",
        lineHeight: "{typography.lineHeightScale.2xl}",
      },
      /** MD3 Title Large (22/28); Polaris `headingMd`; Apple Headline */
      headingSubsection: {
        fontSize: "{typography.sizeScale.xl}",
        lineHeight: "{typography.lineHeightScale.xl}",
      },
      /** MD3 Title Small (14/20); Polaris `headingSm` / `headingXs`; Apple Subheadline / Footnote */
      headingGroup: {
        fontSize: "{typography.sizeScale.xs}",
        lineHeight: "{typography.lineHeightScale.xs}",
      },
      /** MD3 Body Large (~16px); Polaris bodyLg; Apple Body / Callout */
      bodyLarge: {
        fontSize: "{typography.sizeScale.s}",
        lineHeight: "{typography.lineHeightScale.s}",
      },
      /** MD3 Body Medium (~14px); Polaris bodyMd; Apple Subheadline / Footnote */
      bodyDefault: {
        fontSize: "{typography.sizeScale.xs}",
        lineHeight: "{typography.lineHeightScale.xs}",
      },
      /** MD3 Body Small (~12px); Polaris bodySm; Apple Footnote */
      bodySmall: {
        fontSize: "{typography.sizeScale.2xs}",
        lineHeight: "{typography.lineHeightScale.2xs}",
      },
      /** MD3 Label Large (14/20): кегль как у Body Medium, межстрочный плотнее (`2xs`), чем у `body-default` */
      bodyCompact: {
        fontSize: "{typography.sizeScale.xs}",
        lineHeight: "{typography.lineHeightScale.2xs}",
      },
      /** MD3 Label Medium (~12px); Apple Caption1 */
      caption: {
        fontSize: "{typography.sizeScale.2xs}",
        lineHeight: "{typography.lineHeightScale.2xs}",
      },
      /** MD3 Label Small (~11px); Apple Caption2 */
      captionMicro: {
        fontSize: "{typography.sizeScale.labelMicro}",
        lineHeight: "{typography.lineHeightScale.labelMicro}",
      },
    },
  },
  shape: {
    radius: {
      xs: "{radius.xs}",
      s: "{radius.s}",
      m: "{radius.m}",
      l: "{radius.l}",
      "4xl": "{radius.4xl}",
      round: "{radius.round}",
    },
  },
  border: {
    width: {
      control: "1px",
      focusRing: "2px",
    },
  },
  /**
   * Алиасы сетки → примитивы `spaces.layout.*`. `x*` — счётчики шагов по **4px** для layout (drawer и т.д.).
   */
  spacing: {
    xs: "{spaces.layout.xs}",
    s: "{spaces.layout.s}",
    m: "{spaces.layout.m}",
    l: "{spaces.layout.l}",
    xl: "{spaces.layout.xl}",
    "2xl": "{spaces.layout.2xl}",
    "3xl": "{spaces.layout.3xl}",
    "4xl": "{spaces.layout.4xl}",
    "5xl": "{spaces.layout.5xl}",
    "6xl": "{spaces.layout.6xl}",
    x0: "{spaces.layout.0}",
    x1: "{spaces.layout.xs}",
    x2: "{spaces.layout.s}",
    x3: "{spaces.layout.m}",
    x4: "{spaces.layout.l}",
    x5: "{spaces.layout.xl}",
    x6: "{spaces.layout.2xl}",
    x8: "{spaces.layout.3xl}",
    x10: "{spaces.layout.4xl}",
    x12: "{spaces.layout.5xl}",
    x14: "{spaces.layout.6xl}",
  },
  /**
   * Слои наложения: одна ось `elevation.zIndex.*` на весь кит. Потребители подставляют `--prime-sys-elevation-zIndex-*`.
   * Порядок: base → sticky → popover → dropdown → tooltip → modal (= drawer) → toast.
   */
  elevation: {
    zIndex: {
      base: "{zIndex.base}",
      sticky: "{zIndex.sticky}",
      popover: "{zIndex.popover}",
      dropdown: "{zIndex.dropdown}",
      tooltip: "{zIndex.tooltip}",
      modal: "{zIndex.modal}",
      /** Тот же уровень, что `modal`: `Drawer`, fullscreen mobile `Sidebar`. */
      drawer: "{zIndex.modal}",
      toast: "{zIndex.toast}",
    },
    shadow: {
      surface: "{shadow.s}",
      modal: "{shadow.3xl}",
      tooltip: "0 12px 28px rgba(15, 17, 21, 0.22), 0 4px 10px rgba(15, 17, 21, 0.16)",
      buttonFocus: "0 0 0 2px rgba(10, 10, 12, 0.14)",
      primaryFocus: "0 0 0 2px rgba(10, 10, 12, 0.2)",
      errorFocus: "0 0 0 2px rgba(220, 38, 38, 0.2)",
      fancyButtonNeutral:
        "0 1px 2px rgba(14, 18, 27, 0.24), 0 0 0 1px var(--prime-sys-color-content-primary)",
      fancyButtonPrimary:
        "0 1px 2px rgba(14, 18, 27, 0.24), 0 0 0 1px var(--prime-sys-color-action-primaryBackground)",
      fancyButtonError:
        "0 1px 2px rgba(14, 18, 27, 0.24), 0 0 0 1px var(--prime-sys-color-action-errorBackground)",
    },
  },
  size: {
    /**
     * Ярусы контрола: одна ось высоты (`size.*`), общая иконка/типографика,
     * `gap` / `inputPaddingX` — `primitive.spaces.control.spacing.*` (линейно s→xl), совпадают внутри яруса.
     * `buttonPadding*` — `primitive.spaces.control.button.*` (линейно s→xl).
     * `inputPaddingY` — вертикаль поля (по `spacing.*`).
     * `radius` — `primitive.radius.*` по ярусу (контролы xs…xl; см. `shape.radius` для крупных поверхностей).
     */
    control: {
      xs: {
        height: "{size.xs}",
        radius: "{radius.xs}",
        icon: "{icon.xs}",
        gap: "{spacing.xs}",
        buttonPaddingX: "{spacing.s}",
        buttonPaddingY: "{spacing.s}",
        inputPaddingX: "{spacing.xs}",
        inputPaddingY: "{spacing.xs}",
        text: "{typography.support.3xs}",
        supportText: "{typography.support.3xs}",
      },
      s: {
        height: "{size.s}",
        radius: "{radius.s}",
        icon: "{icon.s}",
        gap: "{spaces.control.spacing.s}",
        buttonPaddingX: "{spaces.control.button.s}",
        buttonPaddingY: "{spaces.control.button.s}",
        inputPaddingX: "{spaces.control.spacing.s}",
        inputPaddingY: "{spacing.xs}",
        text: "{typography.support.2xs}",
        supportText: "{typography.support.2xs}",
      },
      m: {
        height: "{size.m}",
        radius: "{radius.m}",
        icon: "{icon.m}",
        gap: "{spaces.control.spacing.m}",
        buttonPaddingX: "{spaces.control.button.m}",
        buttonPaddingY: "{spaces.control.button.m}",
        inputPaddingX: "{spaces.control.spacing.m}",
        inputPaddingY: "{spacing.s}",
        text: "{typography.control.s}",
        supportText: "{typography.support.2xs}",
      },
      l: {
        height: "{size.l}",
        radius: "{radius.l}",
        icon: "{icon.l}",
        gap: "{spaces.control.spacing.l}",
        buttonPaddingX: "{spaces.control.button.l}",
        buttonPaddingY: "{spaces.control.button.l}",
        inputPaddingX: "{spaces.control.spacing.l}",
        inputPaddingY: "{spacing.s}",
        text: "{typography.control.m}",
        supportText: "{typography.support.xs}",
      },
      xl: {
        height: "{size.xl}",
        radius: "{radius.xl}",
        icon: "{icon.xl}",
        gap: "{spaces.control.spacing.xl}",
        buttonPaddingX: "{spaces.control.button.xl}",
        buttonPaddingY: "{spaces.control.button.xl}",
        inputPaddingX: "{spaces.control.spacing.xl}",
        inputPaddingY: "{spacing.m}",
        text: "{typography.control.l}",
        supportText: "{typography.support.xs}",
      },
    },
    modal: {
      radius: "{shape.radius.4xl}",
      maxWidth: "30rem",
      paddingX: "{spacing.xl}",
      paddingY: "{spacing.xl}",
      titleGap: "{spacing.s}",
      contentGap: "{spacing.l}",
      headerGap: "{spacing.m}",
      headerPaddingBottom: "{spacing.l}",
      headTextPaddingRight: "{spacing.3xl}",
      bodyGap: "{spacing.l}",
      footerGap: "{spacing.m}",
      footerPaddingTop: "{spacing.l}",
      overlayPaddingX: "{spacing.l}",
      overlayPaddingY: "{spacing.l}",
      headerIconSize: "{size.m}",
    },
    drawer: {
      s: {
        paddingX: "{spacing.x3}",
        paddingY: "{spacing.x3}",
        titleGap: "{size.control.s.gap}",
        headerGap: "{spacing.x2}",
        footerGap: "{spacing.x2}",
        titleText: "{size.control.s.text}",
      },
      m: {
        paddingX: "{spacing.x5}",
        paddingY: "{spacing.x5}",
        titleGap: "{size.control.m.gap}",
        headerGap: "{spacing.x3}",
        footerGap: "{spacing.x3}",
        titleText: "{size.control.m.text}",
      },
      l: {
        paddingX: "{spacing.x6}",
        paddingY: "{spacing.x6}",
        titleGap: "{size.control.l.gap}",
        headerGap: "{spacing.x3}",
        footerGap: "{spacing.x3}",
        titleText: "{size.control.l.text}",
      },
      xl: {
        paddingX: "{spacing.x8}",
        paddingY: "{spacing.x8}",
        titleGap: "{size.control.xl.gap}",
        headerGap: "{spacing.x4}",
        footerGap: "{spacing.x4}",
        titleText: "{size.control.xl.text}",
      },
    },
    /** Внутренний отступ: одно значение на обе оси (см. `paddingX` = Y). */
    textarea: {
      s: {
        minHeight: "4rem",
        radius: "{radius.s}",
        paddingX: "{spacing.s}",
      },
      m: {
        minHeight: "5rem",
        radius: "{radius.m}",
        paddingX: "{spacing.m}",
      },
      l: {
        minHeight: "6rem",
        radius: "{radius.l}",
        paddingX: "{spacing.l}",
      },
      xl: {
        minHeight: "8rem",
        radius: "{radius.xl}",
        paddingX: "{spacing.xl}",
      },
    },
    choice: {
      s: {
        control: "{icon.s}",
        dot: "{spaces.layout.xs}",
        gap: "{spacing.s}",
        text: "{typography.support.2xs}",
      },
      m: {
        control: "{icon.m}",
        dot: "{spaces.layout.s}",
        gap: "{spacing.s}",
        text: "{typography.control.s}",
      },
      l: {
        control: "{icon.l}",
        dot: "{spaces.layout.s}",
        gap: "{spacing.m}",
        text: "{typography.control.m}",
      },
      xl: {
        control: "{icon.xl}",
        dot: "{spaces.layout.m}",
        gap: "{spacing.l}",
        text: "{typography.control.l}",
      },
    },
    switch: {
      s: {
        trackWidth: "1.75rem",
        trackHeight: "1rem",
        thumb: "{icon.xs}",
      },
      m: {
        trackWidth: "2rem",
        trackHeight: "1.25rem",
        thumb: "{icon.s}",
      },
      l: {
        trackWidth: "2.25rem",
        trackHeight: "1.25rem",
        thumb: "{icon.m}",
      },
      xl: {
        trackWidth: "2.5rem",
        trackHeight: "1.5rem",
        thumb: "{icon.l}",
      },
    },
    /** На ступень ниже кнопки того же яруса; высота из контента + `paddingY`. Боковые — `buttonPaddingX`. */
    badge: {
      s: {
        paddingX: "{size.control.xs.buttonPaddingX}",
        paddingY: "{size.control.xs.inputPaddingY}",
        text: "{size.control.xs.text}",
        dotSize: "{spaces.layout.xs}",
        iconSize: "{size.control.xs.icon}",
        gap: "{size.control.xs.gap}",
        radius: "{size.control.xs.radius}",
      },
      m: {
        paddingX: "{size.control.s.buttonPaddingX}",
        paddingY: "{size.control.s.inputPaddingY}",
        text: "{size.control.s.text}",
        dotSize: "{spaces.layout.s}",
        iconSize: "{size.control.s.icon}",
        gap: "{size.control.s.gap}",
        radius: "{size.control.s.radius}",
      },
      l: {
        paddingX: "{size.control.m.buttonPaddingX}",
        paddingY: "{size.control.m.inputPaddingY}",
        text: "{size.control.m.text}",
        dotSize: "{spaces.layout.m}",
        iconSize: "{size.control.m.icon}",
        gap: "{size.control.m.gap}",
        radius: "{size.control.m.radius}",
      },
      xl: {
        paddingX: "{size.control.l.buttonPaddingX}",
        paddingY: "{size.control.l.inputPaddingY}",
        text: "{size.control.l.text}",
        dotSize: "{spaces.layout.l}",
        iconSize: "{size.control.l.icon}",
        gap: "{size.control.l.gap}",
        radius: "{size.control.l.radius}",
      },
    },
    avatar: {
      s: { size: "{size.s}", text: "{typography.support.2xs}", radius: "{shape.radius.round}" },
      m: { size: "{size.m}", text: "{typography.support.2xs}", radius: "{shape.radius.round}" },
      l: { size: "{size.l}", text: "{typography.control.s}", radius: "{shape.radius.round}" },
      xl: { size: "{size.xl}", text: "{typography.control.l}", radius: "{shape.radius.round}" },
      "2xl": {
        size: "{size.2xl}",
        text: "{typography.sizeScale.2xl}",
        radius: "{shape.radius.round}",
      },
      "3xl": {
        size: "{size.3xl}",
        text: "{typography.sizeScale.3xl}",
        radius: "{shape.radius.round}",
      },
      "4xl": {
        size: "{size.4xl}",
        text: "{typography.sizeScale.4xl}",
        radius: "{shape.radius.round}",
      },
      "5xl": {
        size: "{size.5xl}",
        text: "{typography.sizeScale.5xl}",
        radius: "{shape.radius.round}",
      },
      "6xl": {
        size: "{size.6xl}",
        text: "{typography.sizeScale.6xl}",
        radius: "{shape.radius.round}",
      },
    },
    /** На ступень ниже control того же яруса: компактнее по padding/тексту/радиусу. */
    tooltip: {
      s: {
        paddingX: "{size.control.xs.inputPaddingX}",
        paddingY: "{size.control.xs.inputPaddingY}",
        text: "{size.control.xs.supportText}",
        radius: "{size.control.xs.radius}",
      },
      m: {
        paddingX: "{size.control.s.inputPaddingX}",
        paddingY: "{size.control.s.inputPaddingY}",
        text: "{size.control.s.supportText}",
        radius: "{size.control.s.radius}",
      },
      l: {
        paddingX: "{size.control.m.inputPaddingX}",
        paddingY: "{size.control.m.inputPaddingY}",
        text: "{size.control.m.supportText}",
        radius: "{size.control.m.radius}",
      },
      xl: {
        paddingX: "{size.control.l.inputPaddingX}",
        paddingY: "{size.control.l.inputPaddingY}",
        text: "{size.control.l.supportText}",
        radius: "{size.control.l.radius}",
      },
    },
    /** На ступень ниже кнопки того же яруса (как `size.badge`); боковые — `buttonPaddingX`. */
    tag: {
      s: {
        paddingX: "{size.control.xs.buttonPaddingX}",
        paddingY: "{size.control.xs.inputPaddingY}",
        text: "{size.control.xs.text}",
        iconSize: "{size.control.xs.icon}",
        gap: "{size.control.xs.gap}",
        radius: "{size.control.xs.radius}",
      },
      m: {
        paddingX: "{size.control.s.buttonPaddingX}",
        paddingY: "{size.control.s.inputPaddingY}",
        text: "{size.control.s.text}",
        iconSize: "{size.control.s.icon}",
        gap: "{size.control.s.gap}",
        radius: "{size.control.s.radius}",
      },
      l: {
        paddingX: "{size.control.m.buttonPaddingX}",
        paddingY: "{size.control.m.inputPaddingY}",
        text: "{size.control.m.text}",
        iconSize: "{size.control.m.icon}",
        gap: "{size.control.m.gap}",
        radius: "{size.control.m.radius}",
      },
      xl: {
        paddingX: "{size.control.l.buttonPaddingX}",
        paddingY: "{size.control.l.inputPaddingY}",
        text: "{size.control.l.text}",
        iconSize: "{size.control.l.icon}",
        gap: "{size.control.l.gap}",
        radius: "{size.control.l.radius}",
      },
    },
    /** Ярус `s` на ступень ниже: совпадает с `size.control.xs`. */
    kbd: {
      height: "{size.control.xs.height}",
      paddingX: "{size.control.xs.inputPaddingX}",
      paddingY: "{size.control.xs.inputPaddingY}",
      text: "{size.control.xs.text}",
      radius: "{size.control.xs.radius}",
    },
  },
  motion: {
    duration: {
      fast: "{motion.duration.fast}",
      medium: "{motion.duration.medium}",
      slow: "{motion.duration.slow}",
    },
    easing: {
      standard: "{motion.easing.standard}",
    },
    fast: "{motion.duration.fast}",
    medium: "{motion.duration.medium}",
    slow: "{motion.duration.slow}",
    standard: "{motion.easing.standard}",
  },
} as const;
