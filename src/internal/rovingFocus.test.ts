import { gridIndex, rovingIndex } from "./rovingFocus";

describe("rovingIndex", () => {
  it("wraps arrows around both ends", () => {
    expect(rovingIndex("ArrowRight", 2, 3)).toBe(0);
    expect(rovingIndex("ArrowLeft", 0, 3)).toBe(2);
    expect(rovingIndex("ArrowDown", 0, 3)).toBe(1);
  });

  it("jumps with Home and End", () => {
    expect(rovingIndex("Home", 2, 4)).toBe(0);
    expect(rovingIndex("End", 0, 4)).toBe(3);
  });

  it("accepts only the keys of its orientation", () => {
    expect(rovingIndex("ArrowDown", 0, 3, "horizontal")).toBeNull();
    expect(rovingIndex("ArrowRight", 0, 3, "vertical")).toBeNull();
    expect(rovingIndex("ArrowUp", 1, 3, "vertical")).toBe(0);
  });

  it("starts from the edge when nothing is focused", () => {
    expect(rovingIndex("ArrowRight", -1, 3)).toBe(0);
    expect(rovingIndex("ArrowLeft", -1, 3)).toBe(2);
  });

  it("ignores other keys and empty groups", () => {
    expect(rovingIndex("Enter", 0, 3)).toBeNull();
    expect(rovingIndex("ArrowRight", 0, 0)).toBeNull();
  });
});

describe("gridIndex", () => {
  // 7 items in rows of 3: [0 1 2] [3 4 5] [6]
  it("steps through the reading order and stops at the ends", () => {
    expect(gridIndex("ArrowRight", 2, 7, 3)).toBe(3);
    expect(gridIndex("ArrowRight", 6, 7, 3)).toBe(6);
    expect(gridIndex("ArrowLeft", 0, 7, 3)).toBe(0);
  });

  it("moves by rows and stays put without a row", () => {
    expect(gridIndex("ArrowDown", 1, 7, 3)).toBe(4);
    expect(gridIndex("ArrowDown", 4, 7, 3)).toBe(4);
    expect(gridIndex("ArrowUp", 6, 7, 3)).toBe(3);
    expect(gridIndex("ArrowUp", 1, 7, 3)).toBe(1);
  });

  it("jumps with Home and End and ignores other keys", () => {
    expect(gridIndex("Home", 5, 7, 3)).toBe(0);
    expect(gridIndex("End", 0, 7, 3)).toBe(6);
    expect(gridIndex("Tab", 0, 7, 3)).toBeNull();
  });
});
