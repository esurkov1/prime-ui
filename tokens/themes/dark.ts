export const darkThemeOverrides = {
  color: {
    status: {
      information: {
        background: "{color.blue.950}",
        backgroundEmphasis: "{color.blue.500}",
        foreground: "{color.blue.200}",
        border: "{color.blue.800}",
      },
      warning: {
        background: "{color.orange.950}",
        backgroundEmphasis: "{color.orange.500}",
        foreground: "{color.orange.200}",
        border: "{color.orange.800}",
      },
      success: {
        background: "{color.green.950}",
        backgroundEmphasis: "{color.green.500}",
        foreground: "{color.green.200}",
        border: "{color.green.800}",
      },
      away: {
        background: "{color.yellow.950}",
        backgroundEmphasis: "{color.yellow.500}",
        foreground: "{color.yellow.200}",
        border: "{color.yellow.800}",
      },
      feature: {
        background: "{color.purple.950}",
        backgroundEmphasis: "{color.purple.500}",
        foreground: "{color.purple.200}",
        border: "{color.purple.800}",
      },
      verified: {
        background: "{color.sky.950}",
        backgroundEmphasis: "{color.sky.500}",
        foreground: "{color.sky.200}",
        border: "{color.sky.800}",
      },
      error: {
        background: "{color.red.950}",
        backgroundEmphasis: "{color.red.500}",
        foreground: "{color.red.200}",
        border: "{color.red.800}",
      },
    },
    surface: {
      default: "{color.gray.950}",
      raised: "{color.gray.900}",
      elevated: "{color.gray.800}",
      accentSoft: "{color.gray.800}",
      dangerSoft: "{color.red.950}",
      overlay: "{color.overlay.scrimDark}",
    },
    content: {
      primary: "{color.gray.50}",
      secondary: "{color.gray.300}",
      muted: "{color.gray.400}",
      disabled: "{color.gray.600}",
      inverse: "{color.gray.950}",
      accent: "{color.gray.200}",
      danger: "{color.red.200}",
    },
    border: {
      subtle: "{color.gray.800}",
      separator: "{color.gray.500}",
      strong: "{color.gray.600}",
      emphasis: "{color.gray.50}",
      muted: "{color.gray.700}",
      accent: "{color.gray.500}",
      danger: "{color.red.400}",
      disabled: "{color.gray.800}",
      inverse: "{color.white}",
    },
    action: {
      primaryBackground: "{color.gray.50}",
      primaryBackgroundHover: "{color.gray.200}",
      primaryForeground: "{color.gray.950}",
      primarySoftBackground:
        "color-mix(in srgb, var(--prime-ref-color-gray-50) 42%, var(--prime-ref-color-gray-950))",
      primarySoftForeground: "{color.gray.50}",
      neutralBackground: "{color.gray.900}",
      neutralBackgroundHover: "{color.gray.800}",
      neutralForeground: "{color.gray.50}",
      errorBackground: "{color.red.500}",
      errorBackgroundHover: "{color.red.600}",
      errorForeground: "{color.white}",
    },
    focus: {
      ring: "{color.gray.100}",
    },
    field: {
      bg: "{color.gray.900}",
      text: "{color.gray.50}",
      placeholder: "{color.gray.500}",
      border: "{color.gray.700}",
      borderHover: "{color.gray.600}",
      borderFocus: "{color.gray.300}",
      borderError: "{color.red.400}",
    },
    tooltip: {
      background: "{color.gray.100}",
      foreground: "{color.gray.950}",
      border: "{color.gray.300}",
    },
    dataTable: {
      dividerVertical: "color-mix(in srgb, var(--prime-sys-color-border-subtle) 78%, transparent)",
      dividerHorizontal:
        "color-mix(in srgb, var(--prime-sys-color-border-subtle) 86%, transparent)",
      headBackground: "{color.surface.elevated}",
      rowBackground: "{color.surface.default}",
    },
    badge: {
      grayFilled: {
        background: "{color.gray.500}",
      },
      pink: {
        backgroundSoft: "{color.pink.950}",
        foregroundOnSoft: "{color.pink.200}",
        backgroundEmphasis: "{color.pink.500}",
        border: "{color.pink.800}",
      },
      teal: {
        backgroundSoft: "{color.teal.950}",
        foregroundOnSoft: "{color.teal.200}",
        backgroundEmphasis: "{color.teal.500}",
        border: "{color.teal.800}",
      },
    },
  },
  elevation: {
    shadow: {
      surface: "0 1px 2px rgba(8, 10, 14, 0.35)",
      modal: "0 24px 48px rgba(8, 10, 14, 0.45)",
      tooltip: "0 14px 30px rgba(8, 10, 14, 0.5), 0 4px 10px rgba(8, 10, 14, 0.4)",
      buttonFocus: "0 0 0 2px rgba(244, 244, 245, 0.28)",
      primaryFocus: "0 0 0 2px rgba(244, 244, 245, 0.4)",
      errorFocus: "0 0 0 2px rgba(248, 113, 113, 0.38)",
      fancyButtonNeutral:
        "0 1px 2px rgba(8, 10, 14, 0.45), 0 0 0 1px var(--prime-sys-color-content-primary)",
      fancyButtonPrimary:
        "0 1px 2px rgba(8, 10, 14, 0.45), 0 0 0 1px var(--prime-sys-color-action-primaryBackground)",
      fancyButtonError:
        "0 1px 2px rgba(8, 10, 14, 0.45), 0 0 0 1px var(--prime-sys-color-action-errorBackground)",
    },
  },
} as const;
