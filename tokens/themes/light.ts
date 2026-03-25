export const lightThemeOverrides = {
  color: {
    focus: {
      ring: "{color.gray.950}",
    },
  },
  elevation: {
    shadow: {
      tooltip: "0 12px 28px rgba(15, 17, 21, 0.22), 0 4px 10px rgba(15, 17, 21, 0.16)",
      buttonFocus: "0 0 0 2px rgba(15, 17, 21, 0.14)",
      primaryFocus: "0 0 0 2px rgba(15, 17, 21, 0.2)",
      errorFocus: "0 0 0 2px rgba(220, 38, 38, 0.2)",
    },
  },
} as const;
