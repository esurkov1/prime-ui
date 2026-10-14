import { describe, expect, it } from "vitest";

import {
  afterMotionMs,
  exitTimeoutMs,
  motionDurationMs,
  motionTiming,
  motionToken,
  readCssDurationMs,
  readElementDurationMs,
} from "./motionTiming";
import { TOKEN_DEFAULTS } from "./tokenDefaults";

const root = () => document.documentElement;

describe("motionTiming", () => {
  it("reads a duration token from the document, in ms or s", () => {
    root().style.setProperty("--prime-motion-duration-fast", "0.2s");
    expect(motionDurationMs("fast")).toBe(200);
    root().style.setProperty("--prime-motion-duration-fast", "120ms");
    expect(readCssDurationMs("--prime-motion-duration-fast")).toBe(120);
  });

  it("falls back to the token default when the CSS cannot be read", () => {
    expect(motionDurationMs("base")).toBe(TOKEN_DEFAULTS["--prime-motion-duration-base"]);
  });

  it("reads a component clock as it applies to an element, 0 when unset", () => {
    const element = document.createElement("div");
    document.body.append(element);
    expect(readElementDurationMs(element, "--prime-message-morph-duration")).toBe(0);
    element.style.setProperty("--prime-message-morph-duration", "300ms");
    expect(readElementDurationMs(element, "--prime-message-morph-duration")).toBe(300);
    element.style.setProperty("--prime-message-morph-duration", "0.1s");
    expect(readElementDurationMs(element, "--prime-message-morph-duration")).toBe(100);
    element.remove();
  });

  it("a stopped clock (reduced motion) reads as 0, not as the default", () => {
    root().style.setProperty("--prime-motion-duration-base", "0ms");
    expect(motionDurationMs("base")).toBe(0);
  });

  it("a fallback timeout waits a little past the motion", () => {
    expect(afterMotionMs(100)).toBeGreaterThan(100);
    expect(exitTimeoutMs("fast")).toBe(
      afterMotionMs(TOKEN_DEFAULTS["--prime-motion-duration-fast"]),
    );
  });

  it("builds WAAPI timing from the duration and easing tokens", () => {
    root().style.setProperty("--prime-motion-easing-exit", "ease-out");
    root().style.setProperty("--prime-motion-duration-fast", "230ms");
    expect(motionTiming("fast", "exit")).toEqual({ duration: 230, easing: "ease-out" });
    expect(motionToken("--prime-motion-easing-exit")).toBe("ease-out");
  });

  it("leaves the easing to the browser when the token is missing", () => {
    expect(motionTiming("slow", "emphasized")).toEqual({
      duration: TOKEN_DEFAULTS["--prime-motion-duration-slow"],
    });
  });
});
