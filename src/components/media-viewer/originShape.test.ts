import { afterEach, describe, expect, it } from "vitest";

import { originShape } from "./originShape";

/** Rounds every corner (jsdom does not expand the `border-radius` shorthand into corners). */
function round(element: HTMLElement, radius: string) {
  for (const corner of ["TopLeft", "TopRight", "BottomRight", "BottomLeft"] as const) {
    element.style[`border${corner}Radius`] = radius;
  }
}

/** Lays an element at a fixed rect (jsdom has no layout). */
function place(element: HTMLElement, left: number, top: number, width: number, height: number) {
  element.getBoundingClientRect = () =>
    ({
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
    }) as DOMRect;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("originShape", () => {
  it("rounds only the corners of the clipping album the tile touches", () => {
    // A 2 × 1 album, radius 12, with a square left tile.
    const album = document.createElement("div");
    album.style.overflow = "clip";
    round(album, "12px");
    const tile = document.createElement("div");
    tile.style.overflow = "hidden";
    const image = document.createElement("img");
    tile.append(image);
    album.append(tile);
    document.body.append(album);
    place(album, 100, 100, 400, 200);
    place(tile, 100, 100, 199, 200);
    place(image, 100, 100, 199, 200);

    const shape = originShape(image);
    expect(shape?.radii).toEqual([12, 0, 0, 12]);
    expect(shape?.visible).toEqual({ left: 100, top: 100, right: 299, bottom: 300 });
  });

  it("cuts the part a scroller hides and keeps only the corners still showing", () => {
    const scroller = document.createElement("div");
    scroller.style.overflow = "auto";
    const image = document.createElement("img");
    round(image, "8px");
    scroller.append(image);
    document.body.append(scroller);
    place(scroller, 0, 200, 600, 400);
    // Half of the picture is scrolled up under the scroller's top edge.
    place(image, 50, 150, 200, 100);

    const shape = originShape(image);
    expect(shape?.visible).toEqual({ left: 50, top: 200, right: 250, bottom: 250 });
    expect(shape?.radii).toEqual([0, 0, 8, 8]);
  });

  it("gives up when little of the picture shows", () => {
    const scroller = document.createElement("div");
    scroller.style.overflow = "auto";
    const image = document.createElement("img");
    scroller.append(image);
    document.body.append(scroller);
    place(scroller, 0, 200, 600, 400);
    place(image, 50, 105, 200, 100);
    expect(originShape(image)).toBeNull();
  });
});
