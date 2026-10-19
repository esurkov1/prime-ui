// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  formatProgressValue,
  PROGRESS_SEGMENTS_LABELS,
  resolveRows,
  resolveSegments,
  resolveValue,
  segmentFill,
} from "./progressSegments";

describe("resolveValue", () => {
  it("clamps the value to 0…max and gives its ratio and rounded percent", () => {
    expect(resolveValue(37.4, 200)).toEqual({ value: 37.4, max: 200, ratio: 0.187, percent: 19 });
    expect(resolveValue(250, 200)).toMatchObject({ value: 200, ratio: 1, percent: 100 });
    expect(resolveValue(-5, 200)).toMatchObject({ value: 0, ratio: 0, percent: 0 });
  });

  it("takes 100 for a missing or non-positive max and 0 for a non-finite value", () => {
    expect(resolveValue(40, undefined)).toMatchObject({ max: 100, percent: 40 });
    expect(resolveValue(40, 0)).toMatchObject({ max: 100, percent: 40 });
    expect(resolveValue(Number.NaN, 100)).toMatchObject({ value: 0, percent: 0 });
  });
});

describe("segmentFill", () => {
  it("fills by category color, else by tone, accent by default", () => {
    expect(segmentFill({ value: 1, color: "teal" })).toEqual({ tone: undefined, color: "teal" });
    expect(segmentFill({ value: 1, tone: "danger" })).toEqual({ tone: "danger", color: undefined });
    expect(segmentFill({ value: 1 })).toEqual({ tone: "accent", color: undefined });
  });
});

describe("resolveSegments", () => {
  const STORAGE = [
    { value: 38, label: "Видео" },
    { value: 21, label: "Документы" },
    { value: -4, label: "Корзина" },
  ];

  it("counts negative weights as 0 and fills the sum when no max is given", () => {
    const resolved = resolveSegments(STORAGE, undefined, PROGRESS_SEGMENTS_LABELS);
    expect(resolved).toMatchObject({ total: 59, scale: 59, rest: 0, percent: 100 });
    expect(resolved.segments.map((segment) => segment.value)).toEqual([38, 21, 0]);
    expect(resolved.text).toBe("Видео: 64%, Документы: 36%, Корзина: 0%");
  });

  it("leaves free capacity when max exceeds the sum; a smaller max never cuts it", () => {
    expect(resolveSegments(STORAGE, 100, PROGRESS_SEGMENTS_LABELS)).toMatchObject({
      scale: 100,
      rest: 41,
      percent: 59,
      text: "Видео: 38%, Документы: 21%, Корзина: 0%",
    });
    expect(resolveSegments(STORAGE, 10, PROGRESS_SEGMENTS_LABELS).scale).toBe(59);
  });

  it("names an unlabelled part by its share alone", () => {
    expect(
      resolveSegments([{ value: 1 }, { value: 3 }], undefined, PROGRESS_SEGMENTS_LABELS).text,
    ).toBe("25%, 75%");
  });

  it("describes no segments and all-zero segments with the labels", () => {
    expect(resolveSegments([], undefined, PROGRESS_SEGMENTS_LABELS).text).toBe("Нет сегментов");
    expect(
      resolveSegments([{ value: 0 }, { value: 0 }], undefined, PROGRESS_SEGMENTS_LABELS),
    ).toMatchObject({ text: "Все сегменты пусты", percent: 0 });
  });
});

describe("resolveRows", () => {
  const FUNNEL = [{ value: 400 }, { value: 200 }, { value: 50 }];

  it("sum: length and share of the total, raised by max", () => {
    expect(resolveRows(FUNNEL, "sum", undefined).map((row) => row.percent)).toEqual([62, 31, 8]);
    expect(resolveRows(FUNNEL, "sum", 1000).map((row) => row.ratio)).toEqual([0.4, 0.2, 0.05]);
  });

  it("max: the leader is a full bar, the share stays of the total", () => {
    const rows = resolveRows(FUNNEL, "max", undefined);
    expect(rows.map((row) => row.ratio)).toEqual([1, 0.5, 0.125]);
    expect(rows.map((row) => row.percent)).toEqual([62, 31, 8]);
  });

  it("first: length and share against the first row, as a funnel", () => {
    const rows = resolveRows(FUNNEL, "first", undefined);
    expect(rows.map((row) => row.ratio)).toEqual([1, 0.5, 0.125]);
    expect(rows.map((row) => row.percent)).toEqual([100, 50, 13]);
  });

  it("own: each row against its own max, else the root max, else 100; overload keeps its share", () => {
    const rows = resolveRows(
      [{ value: 30, max: 40 }, { value: 45 }, { value: 12, max: 10 }, { value: 5, max: 0 }],
      "own",
      undefined,
    );
    expect(rows.map((row) => row.ratio)).toEqual([0.75, 0.45, 1, 0.05]);
    expect(rows.map((row) => row.percent)).toEqual([75, 45, 120, 5]);
    expect(resolveRows([{ value: 30 }], "own", 60).map((row) => row.percent)).toEqual([50]);
  });

  it("draws nothing for an all-zero ranking", () => {
    expect(resolveRows([{ value: 0 }], "max", undefined)).toEqual([
      { segment: { value: 0 }, ratio: 0, percent: 0 },
    ]);
  });
});

describe("formatProgressValue", () => {
  it("groups digits the Russian way", () => {
    expect(formatProgressValue(1234567).replace(/\s/g, " ")).toBe("1 234 567");
  });
});
