import { describe, expect, it } from "vitest";

import { namedRole } from "./namedRole";

describe("namedRole", () => {
  it("gives a named element the role and leaves an unnamed one without", () => {
    expect(namedRole({ "aria-label": "Фильтры" }, "group")).toBe("group");
    expect(namedRole({ "aria-labelledby": "title" }, "group")).toBe("group");
    expect(namedRole({}, "group")).toBeUndefined();
  });

  it("keeps an explicit role", () => {
    expect(namedRole({ role: "toolbar", "aria-label": "Фильтры" }, "group")).toBe("toolbar");
  });
});
