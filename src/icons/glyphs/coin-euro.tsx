import { defineCoinGlyph } from "../glyph";

/** A coin with the euro sign: the sign pops into place. */
export const CoinEuro = /* @__PURE__ */ defineCoinGlyph(
  "euro",
  <>
    <path d="M15.5 8.5a4.5 4.5 0 1 0 0 7" />
    <path d="M7.5 11h5" />
    <path d="M7.5 13.5h4" />
  </>,
);
