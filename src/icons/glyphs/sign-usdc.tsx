import { defineSignGlyph } from "../glyph";

/** USD Coin (USDC): a C in its coin, as on its mark; pops into place. */
export const SignUsdc = /* @__PURE__ */ defineSignGlyph(
  "usdc",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M15.5 9a4 4 0 1 0 0 6" />
  </>,
);
