import { defineCoinGlyph } from "../glyph";

/** A coin with the tugrik sign ₮ of Tether (USDT): the sign pops into place. */
export const CoinTether = /* @__PURE__ */ defineCoinGlyph(
  "tether",
  <>
    <path d="M8 7.5h8" />
    <path d="M12 7.5v9.5" />
    <path d="m9.5 12.5 5-1.5" />
    <path d="m9.5 15.5 5-1.5" />
  </>,
);
