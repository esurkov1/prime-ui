import { renderHook } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";

import { AUTOFILL_OFF, AutofillScope, useAutofill } from "./autofill";

const inScope = ({ children }: { children: React.ReactNode }) => (
  <AutofillScope>{children}</AutofillScope>
);

describe("useAutofill", () => {
  it("turns autofill and the password managers off without a token", () => {
    const { result } = renderHook(() => useAutofill(undefined));
    expect(result.current).toEqual({
      autoComplete: "off",
      "data-1p-ignore": "true",
      "data-lpignore": "true",
      "data-bwignore": "true",
      "data-form-type": "other",
    });
  });

  it("keeps everything off for an explicit off", () => {
    const { result } = renderHook(() => useAutofill("off"));
    expect(result.current).toBe(AUTOFILL_OFF);
  });

  it("passes a consumer token through and drops the opt-outs", () => {
    const { result } = renderHook(() => useAutofill("current-password"));
    expect(result.current).toEqual({ autoComplete: "current-password" });
  });

  it("leaves a field without a token to the browser inside a sign-in form", () => {
    const { result } = renderHook(() => useAutofill(undefined), { wrapper: inScope });
    expect(result.current).toEqual({});
  });

  it("still honours an explicit off inside a sign-in form", () => {
    const { result } = renderHook(() => useAutofill("off"), { wrapper: inScope });
    expect(result.current).toBe(AUTOFILL_OFF);
  });
});
