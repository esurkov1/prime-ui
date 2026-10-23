import { describe, expect, it } from "vitest";
import { splitFileName, splitNameTail } from "./fileName";

describe("splitFileName", () => {
  it("cuts the final extension only", () => {
    expect(splitFileName("Акт сверки.pdf")).toEqual({ base: "Акт сверки", ext: "pdf" });
    expect(splitFileName("отчёт.final.PDF")).toEqual({ base: "отчёт.final", ext: "pdf" });
  });
  it("keeps a name without an extension or a dotfile whole", () => {
    expect(splitFileName("README")).toEqual({ base: "README", ext: "" });
    expect(splitFileName(".env")).toEqual({ base: ".env", ext: "" });
    expect(splitFileName("name.")).toEqual({ base: "name.", ext: "" });
  });
});

describe("splitNameTail", () => {
  it("keeps the last characters apart for a long name", () => {
    expect(splitNameTail("Договор поставки № 318.pdf")).toEqual({
      head: "Договор поставки № 3",
      tail: "18.pdf",
    });
  });
  it("leaves a short name whole", () => {
    expect(splitNameTail("report.pdf")).toEqual({ head: "report.pdf", tail: "" });
  });
});
