import * as React from "react";

import { createComponentContext } from "@/internal/context";

export type PlaygroundThemeScheme = "light" | "dark";
export type PlaygroundThemePreset =
  | "obsidian"
  | "vercel-blue"
  | "linear-indigo"
  | "stripe-violet"
  | "github-accent"
  | "shopify-emerald"
  | "slack-plum"
  | "figma-sunset"
  | "spotify-green"
  | "monaco-cyan"
  | "slate-steel"
  | "sage-studio"
  | "mauve-dusk"
  | "petrol-quiet"
  | "taupe-umber"
  | "anthracite-cool"
  | "ink-grape"
  | "bronze-champagne"
  | "navy-fog"
  | "iris-ash"
  | "wine-leather"
  | "oxide-teal"
  | "pearl-stone"
  | "mist-indigo"
  | "cedar-moss";

export const PLAYGROUND_THEME_PRESET_OPTIONS: ReadonlyArray<{
  value: PlaygroundThemePreset;
  label: string;
}> = [
  { value: "obsidian", label: "Obsidian" },
  { value: "vercel-blue", label: "Vercel Blue" },
  { value: "linear-indigo", label: "Linear Indigo" },
  { value: "stripe-violet", label: "Stripe Violet" },
  { value: "github-accent", label: "GitHub Accent" },
  { value: "shopify-emerald", label: "Shopify Emerald" },
  { value: "slack-plum", label: "Slack Plum" },
  { value: "figma-sunset", label: "Figma Sunset" },
  { value: "spotify-green", label: "Spotify Green" },
  { value: "monaco-cyan", label: "Monaco Cyan" },
  { value: "slate-steel", label: "Slate Steel" },
  { value: "sage-studio", label: "Sage Studio" },
  { value: "mauve-dusk", label: "Mauve Dusk" },
  { value: "petrol-quiet", label: "Petrol Quiet" },
  { value: "taupe-umber", label: "Taupe Umber" },
  { value: "anthracite-cool", label: "Anthracite Cool" },
  { value: "ink-grape", label: "Ink Grape" },
  { value: "bronze-champagne", label: "Bronze Champagne" },
  { value: "navy-fog", label: "Navy Fog" },
  { value: "iris-ash", label: "Iris Ash" },
  { value: "wine-leather", label: "Wine Leather" },
  { value: "oxide-teal", label: "Oxide Teal" },
  { value: "pearl-stone", label: "Pearl Stone" },
  { value: "mist-indigo", label: "Mist Indigo" },
  { value: "cedar-moss", label: "Cedar Moss" },
];

type PlaygroundThemeContextValue = {
  scheme: PlaygroundThemeScheme;
  setScheme: (next: PlaygroundThemeScheme) => void;
  toggleScheme: () => void;
  preset: PlaygroundThemePreset;
  setPreset: (next: PlaygroundThemePreset) => void;
};

const [PlaygroundThemeProviderInternal, usePlaygroundTheme] =
  createComponentContext<PlaygroundThemeContextValue>("PlaygroundTheme");

export { usePlaygroundTheme };

const STORAGE_KEY = "prime-playground-theme";
const PRESET_STORAGE_KEY = "prime-playground-theme-preset";

function isPlaygroundThemePreset(value: string): value is PlaygroundThemePreset {
  return PLAYGROUND_THEME_PRESET_OPTIONS.some((option) => option.value === value);
}

function getInitialThemeScheme(): PlaygroundThemeScheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const fromDocument = document.documentElement.dataset.theme;
  if (fromDocument === "light" || fromDocument === "dark") {
    return fromDocument;
  }

  const fromStorage = window.localStorage.getItem(STORAGE_KEY);
  if (fromStorage === "light" || fromStorage === "dark") {
    return fromStorage;
  }

  return "light";
}

function getInitialThemePreset(): PlaygroundThemePreset {
  if (typeof window === "undefined") {
    return "obsidian";
  }

  const fromDocument = document.documentElement.dataset.themePreset;
  if (fromDocument && isPlaygroundThemePreset(fromDocument)) {
    return fromDocument;
  }

  const fromStorage = window.localStorage.getItem(PRESET_STORAGE_KEY);
  if (fromStorage && isPlaygroundThemePreset(fromStorage)) {
    return fromStorage;
  }

  return "obsidian";
}

export function PlaygroundThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = React.useState<PlaygroundThemeScheme>(() => getInitialThemeScheme());
  const [preset, setPreset] = React.useState<PlaygroundThemePreset>(() => getInitialThemePreset());

  React.useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    document.documentElement.dataset.theme = scheme;
    window.localStorage.setItem(STORAGE_KEY, scheme);
  }, [scheme]);

  React.useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    document.documentElement.dataset.themePreset = preset;
    window.localStorage.setItem(PRESET_STORAGE_KEY, preset);
  }, [preset]);

  const toggleScheme = React.useCallback(() => {
    setScheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = React.useMemo(
    () => ({
      scheme,
      setScheme,
      toggleScheme,
      preset,
      setPreset,
    }),
    [scheme, toggleScheme, preset],
  );

  return (
    <PlaygroundThemeProviderInternal value={value}>{children}</PlaygroundThemeProviderInternal>
  );
}
