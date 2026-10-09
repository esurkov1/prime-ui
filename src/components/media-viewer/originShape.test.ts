import { afterEach, describe, expect, it } from "vitest";

import { findItemMedia, originShape } from "./originShape";

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

describe("findItemMedia", () => {
  it("finds an item's own thumbnail on the page, nearest the one it opened from", () => {
    document.body.innerHTML = `
      <section id="other"><img src="/b-small.jpg" /></section>
      <div id="grid">
        <button><img src="/a-small.jpg" /></button>
        <button><img src="/b-small.jpg" /></button>
        <button><video src="/clip.mp4#t=0.001"></video></button>
      </div>`;
    const opener = document.querySelector("#grid img") as HTMLElement;
    const inGrid = document.querySelectorAll("#grid img")[1];
    expect(findItemMedia({ src: "/b.jpg", thumbnail: "/b-small.jpg" }, opener, null)).toBe(inGrid);
    // A video tile asks for its first frame with a fragment: the source still matches.
    expect(findItemMedia({ type: "video", src: "/clip.mp4" }, opener, null)).toBe(
      document.querySelector("#grid video"),
    );
    expect(findItemMedia({ src: "/missing.jpg" }, opener, null)).toBeNull();
  });

  it("never picks a picture inside the viewer itself", () => {
    document.body.innerHTML = `<div id="viewer"><img src="/a.jpg" /></div>`;
    const viewer = document.querySelector("#viewer");
    expect(findItemMedia({ src: "/a.jpg" }, null, viewer)).toBeNull();
  });
});
