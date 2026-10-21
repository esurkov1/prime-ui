import { defineCoinGlyph } from "../glyph";

/** A coin with the baht sign: the sign pops into place. */
export const CoinBaht = /* @__PURE__ */ defineCoinGlyph(
  "baht",
  <>
    <path d="M10 7.5v9" />
    <path d="M10 7.5h3a2.25 2.25 0 0 1 0 4.5h-3" />
    <path d="M10 12h3.5a2.25 2.25 0 0 1 0 4.5H10" />
    <path d="M12 6v12" />
  </>,
);
