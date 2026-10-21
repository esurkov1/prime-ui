import { defineCoinGlyph } from "../glyph";

/** A coin with the ruble sign: the sign pops into place. */
export const CoinRuble = /* @__PURE__ */ defineCoinGlyph(
  "ruble",
  <>
    <path d="M10 17V7h3a2.5 2.5 0 0 1 0 5H8.5" />
    <path d="M8.5 14.5h5" />
  </>,
);
