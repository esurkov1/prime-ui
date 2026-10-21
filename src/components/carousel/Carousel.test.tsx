import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import enterMotion from "@/internal/enterMotion.module.css";
import { HOVER_SETTLE_MS } from "@/internal/longPress";
import pill from "@/internal/mediaPill.module.css";
import { cssRule, cssValue } from "@/test/css";

import { Carousel, type CarouselItem } from "./Carousel";
import { indicatorSpan } from "./carouselTrack";

const PHOTOS: CarouselItem[] = [
  { src: "/front.jpg", alt: "Спереди" },
  { src: "/side.jpg", alt: "Сбоку" },
  { src: "/rear.jpg", alt: "Сзади" },
  { src: "/dash.jpg", alt: "Приборы" },
];

const WIDTH = 400;

const CSS = "src/components/carousel/Carousel.module.css";

/** jsdom has no PointerEvent: a MouseEvent carrying the pointer fields React reads. */
function pointer(
  target: Element,
  type: string,
  {
    x,
    y = 50,
    pointerType = "touch",
    t = 0,
  }: { x: number; y?: number; pointerType?: string; t?: number },
) {
  // React derives enter / leave from over / out with the element the pointer came from or went to.
  const crossing = type === "pointerenter" || type === "pointerleave";
  const event = new MouseEvent(
    type === "pointerenter" ? "pointerover" : type === "pointerleave" ? "pointerout" : type,
    {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      relatedTarget: crossing ? document.body : null,
    },
  );
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    isPrimary: { value: true },
    pointerType: { value: pointerType },
    timeStamp: { value: t },
  });
  act(() => {
    target.dispatchEvent(event);
  });
}

/** The track writes its places on the next frame. */
const nextFrame = () => act(() => new Promise((resolve) => requestAnimationFrame(resolve)));

/** A finger from `from` to `to` (x) in five moves, 20 ms apart. */
function swipe(target: Element, from: number, to: number, pointerType = "touch") {
  pointer(target, "pointerdown", { x: from, pointerType });
  for (let i = 1; i <= 5; i++) {
    pointer(target, "pointermove", { x: from + ((to - from) * i) / 5, pointerType, t: i * 20 });
  }
  pointer(target, "pointerup", { x: to, pointerType, t: 100 });
}

/** `matchMedia` with the queries the test asks to match (and nothing else). */
function stubMedia(...matching: string[]) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matching.some((part) => query.includes(part)),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}

const region = () => screen.getByRole("region", { name: "Фотографии" });
const slides = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[aria-roledescription="слайд"]'));
const currentSlide = () => slides().find((slide) => !slide.hasAttribute("aria-hidden"));

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(WIDTH);
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    right: WIDTH,
    bottom: 300,
    width: WIDTH,
    height: 300,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Carousel", () => {
  it("is a named carousel region of named slides, the others hidden", () => {
    render(<Carousel.Root items={PHOTOS} />);
    const root = region();
    expect(root).toHaveAttribute("aria-roledescription", "карусель");
    expect(root).toHaveAttribute("tabindex", "0");
    expect(root).toHaveAttribute("data-ratio", "4:3");
    const all = slides();
    expect(all).toHaveLength(4);
    expect(all[0]).toHaveAttribute("role", "group");
    expect(all[0]).toHaveAccessibleName("Фото 1 из 4");
    expect(all[0]).not.toHaveAttribute("aria-hidden");
    expect(all[1]).toHaveAttribute("aria-hidden", "true");
    expect(all[1]).toHaveAttribute("inert");
    const dots = screen.getAllByRole("button", { name: /^Фото \d из 4$/ });
    expect(dots).toHaveLength(4);
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    expect(dots[0]).toHaveAttribute("tabindex", "0");
    expect(dots[1]).toHaveAttribute("tabindex", "-1");
  });

  it("takes its name from aria-label and its strings from labels", () => {
    render(
      <Carousel.Root
        items={PHOTOS}
        aria-label="Фото Kia Rio"
        labels={{ photo: "Снимок {current}/{total}" }}
      />,
    );
    expect(screen.getByRole("region", { name: "Фото Kia Rio" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Снимок 2/4" })).toBeInTheDocument();
  });

  it("a dot shows its slide, reports it and announces it", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Carousel.Root items={PHOTOS} onIndexChange={onIndexChange} />);
    await user.click(screen.getByRole("button", { name: "Фото 3 из 4" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
    expect(currentSlide()).toHaveAccessibleName("Фото 3 из 4");
    expect(screen.getByRole("button", { name: "Фото 3 из 4" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Фото 3 из 4");
  });

  it("the arrow keys, Home and End move from the focused carousel; an end holds without loop", async () => {
    const user = userEvent.setup();
    render(<Carousel.Root items={PHOTOS} />);
    region().focus();
    await user.keyboard("{ArrowLeft}");
    expect(currentSlide()).toHaveAccessibleName("Фото 1 из 4");
    await user.keyboard("{ArrowRight}");
    expect(currentSlide()).toHaveAccessibleName("Фото 2 из 4");
    await user.keyboard("{End}");
    expect(currentSlide()).toHaveAccessibleName("Фото 4 из 4");
    await user.keyboard("{ArrowRight}");
    expect(currentSlide()).toHaveAccessibleName("Фото 4 из 4");
    await user.keyboard("{Home}");
    expect(currentSlide()).toHaveAccessibleName("Фото 1 из 4");
  });

  it("on a dot the arrows move the slide and the focus to the new dot", async () => {
    const user = userEvent.setup();
    render(<Carousel.Root items={PHOTOS} />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: "Фото 1 из 4" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(currentSlide()).toHaveAccessibleName("Фото 2 из 4");
    expect(screen.getByRole("button", { name: "Фото 2 из 4" })).toHaveFocus();
  });

  it("loop wraps past the ends", async () => {
    const user = userEvent.setup();
    render(<Carousel.Root items={PHOTOS} loop />);
    region().focus();
    await user.keyboard("{ArrowLeft}");
    expect(currentSlide()).toHaveAccessibleName("Фото 4 из 4");
    await user.keyboard("{ArrowRight}");
    expect(currentSlide()).toHaveAccessibleName("Фото 1 из 4");
  });

  it("is controlled by index", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    const { rerender } = render(
      <Carousel.Root items={PHOTOS} index={1} onIndexChange={onIndexChange} />,
    );
    expect(currentSlide()).toHaveAccessibleName("Фото 2 из 4");
    region().focus();
    await user.keyboard("{ArrowRight}");
    expect(onIndexChange).toHaveBeenCalledWith(2);
    // The parent did not take the change: the slide stays.
    expect(currentSlide()).toHaveAccessibleName("Фото 2 из 4");
    rerender(<Carousel.Root items={PHOTOS} index={3} onIndexChange={onIndexChange} />);
    expect(currentSlide()).toHaveAccessibleName("Фото 4 из 4");
  });

  it("the arrows step and leave at an end without loop", async () => {
    const user = userEvent.setup();
    render(<Carousel.Root items={PHOTOS} arrows defaultIndex={2} />);
    expect(screen.getByRole("button", { name: "Предыдущее фото" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Следующее фото" }));
    expect(currentSlide()).toHaveAccessibleName("Фото 4 из 4");
    expect(screen.queryByRole("button", { name: "Следующее фото" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Предыдущее фото" }));
    expect(currentSlide()).toHaveAccessibleName("Фото 3 из 4");
  });

  it("a press, Enter or Space opens the current item; a dot does not", async () => {
    const user = userEvent.setup();
    const onItemOpen = vi.fn();
    render(<Carousel.Root items={PHOTOS} defaultIndex={1} onItemOpen={onItemOpen} />);
    await user.click(currentSlide() as HTMLElement);
    expect(onItemOpen).toHaveBeenLastCalledWith(1);
    await user.click(screen.getByRole("button", { name: "Фото 3 из 4" }));
    expect(onItemOpen).toHaveBeenCalledTimes(1);
    region().focus();
    await user.keyboard("{Enter}");
    expect(onItemOpen).toHaveBeenLastCalledWith(2);
    await user.keyboard(" ");
    expect(onItemOpen).toHaveBeenCalledTimes(3);
  });

  it("a finger swipes to the next and the previous slide; an end resists", () => {
    const onIndexChange = vi.fn();
    render(<Carousel.Root items={PHOTOS} onIndexChange={onIndexChange} />);
    const root = region();
    swipe(root, 300, 60);
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    swipe(root, 60, 300);
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
    swipe(root, 60, 300);
    expect(onIndexChange).toHaveBeenCalledTimes(2);
    expect(currentSlide()).toHaveAccessibleName("Фото 1 из 4");
  });

  it("a mouse drag swipes too, and its click opens nothing", () => {
    const onIndexChange = vi.fn();
    const onItemOpen = vi.fn();
    render(<Carousel.Root items={PHOTOS} onIndexChange={onIndexChange} onItemOpen={onItemOpen} />);
    swipe(region(), 300, 60, "mouse");
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    fireEvent.click(currentSlide() as HTMLElement);
    expect(onItemOpen).not.toHaveBeenCalled();
  });

  it("a short slow drag springs back; a vertical drag is the page's", () => {
    const onIndexChange = vi.fn();
    render(<Carousel.Root items={PHOTOS} onIndexChange={onIndexChange} />);
    const root = region();
    pointer(root, "pointerdown", { x: 200 });
    pointer(root, "pointermove", { x: 180, t: 20 });
    pointer(root, "pointermove", { x: 170, t: 200 });
    pointer(root, "pointerup", { x: 170, t: 400 });
    swipe(root, 200, 205);
    pointer(root, "pointerdown", { x: 200, y: 50 });
    pointer(root, "pointermove", { x: 190, y: 200, t: 20 });
    pointer(root, "pointermove", { x: 60, y: 210, t: 40 });
    pointer(root, "pointerup", { x: 60, y: 210, t: 60 });
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it("the click after a swipe opens nothing, not even the card around", () => {
    const onItemOpen = vi.fn();
    const onCardClick = vi.fn();
    render(
      // biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: a card that opens on a click, the case under test
      <div onClick={onCardClick}>
        <Carousel.Root items={PHOTOS} onItemOpen={onItemOpen} />
      </div>,
    );
    const root = region();
    swipe(root, 300, 60);
    fireEvent.click(currentSlide() as HTMLElement);
    expect(onItemOpen).not.toHaveBeenCalled();
    expect(onCardClick).not.toHaveBeenCalled();
    fireEvent.click(currentSlide() as HTMLElement);
    expect(onItemOpen).toHaveBeenCalledWith(1);
  });

  it("a hovering mouse scrubs by zones once settled, and leaving brings the slide back", async () => {
    stubMedia("(hover: hover)", "prefers-reduced-motion");
    const onIndexChange = vi.fn();
    render(<Carousel.Root items={PHOTOS} scrub onIndexChange={onIndexChange} />);
    const root = region();
    pointer(root, "pointerenter", { x: 250, pointerType: "mouse" });
    pointer(root, "pointermove", { x: 250, pointerType: "mouse" });
    // A cursor resting where the carousel appeared picks nothing.
    expect(onIndexChange).not.toHaveBeenCalled();
    await act(() => new Promise((resolve) => setTimeout(resolve, HOVER_SETTLE_MS + 20)));
    pointer(root, "pointermove", { x: 250, pointerType: "mouse" });
    expect(currentSlide()).toHaveAccessibleName("Фото 3 из 4");
    pointer(root, "pointermove", { x: 390, pointerType: "mouse" });
    expect(currentSlide()).toHaveAccessibleName("Фото 4 из 4");
    // The scrub is not announced.
    expect(screen.getByRole("status")).toHaveTextContent("");
    pointer(root, "pointerleave", { x: 410, pointerType: "mouse" });
    expect(currentSlide()).toHaveAccessibleName("Фото 1 из 4");
  });

  it("a press while scrubbing keeps the slide; a touch never scrubs; without scrub nothing follows", async () => {
    stubMedia("(hover: hover)", "prefers-reduced-motion");
    const { rerender } = render(<Carousel.Root items={PHOTOS} scrub />);
    const root = region();
    await act(() => new Promise((resolve) => setTimeout(resolve, HOVER_SETTLE_MS + 20)));
    pointer(root, "pointermove", { x: 250, pointerType: "touch" });
    expect(currentSlide()).toHaveAccessibleName("Фото 1 из 4");
    pointer(root, "pointerenter", { x: 150, pointerType: "mouse" });
    pointer(root, "pointermove", { x: 150, pointerType: "mouse" });
    pointer(root, "pointerdown", { x: 150, pointerType: "mouse" });
    pointer(root, "pointerup", { x: 150, pointerType: "mouse" });
    pointer(root, "pointerleave", { x: 410, pointerType: "mouse" });
    expect(currentSlide()).toHaveAccessibleName("Фото 2 из 4");
    rerender(<Carousel.Root items={PHOTOS} />);
    pointer(root, "pointerenter", { x: 390, pointerType: "mouse" });
    pointer(root, "pointermove", { x: 390, pointerType: "mouse" });
    expect(currentSlide()).toHaveAccessibleName("Фото 2 из 4");
  });

  it("glides into a new slide, and under reduced motion stands there at once", async () => {
    const user = userEvent.setup();
    stubMedia();
    const { unmount } = render(<Carousel.Root items={PHOTOS} />);
    region().focus();
    await user.keyboard("{ArrowRight}");
    // The new slide starts a page to the right and springs home.
    expect((currentSlide() as HTMLElement).style.transform).toContain(`${WIDTH}px`);
    unmount();
    stubMedia("prefers-reduced-motion");
    render(<Carousel.Root items={PHOTOS} />);
    region().focus();
    await user.keyboard("{ArrowRight}");
    expect((currentSlide() as HTMLElement).style.transform).toBe(
      "translate3d(calc(0% + 0px), 0, 0)",
    );
  });

  it("shows a skeleton while loading, the image tile when empty or broken, no dots for one", () => {
    const { rerender } = render(<Carousel.Root items={PHOTOS} loading />);
    expect(region()).toHaveAttribute("aria-busy", "true");
    expect(slides()).toHaveLength(0);
    rerender(<Carousel.Root items={[]} />);
    expect(screen.getByRole("img", { name: "Нет фото" })).toBeInTheDocument();
    rerender(<Carousel.Root items={[PHOTOS[0] as CarouselItem]} arrows />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    const image = screen.getByRole("img", { name: "Спереди" });
    expect(image).toHaveAttribute("data-status", "loading");
    expect(image).toHaveAttribute("loading", "eager");
    fireEvent.error(image);
    expect(screen.getByRole("img", { name: "Не удалось загрузить" })).toBeInTheDocument();
  });

  it("mounts the slides near the current one, every slide once the pointer or the focus comes in", () => {
    const many = Array.from({ length: 8 }, (_, at) => ({ src: `/p${at}.jpg`, alt: `Фото ${at}` }));
    render(<Carousel.Root items={many} />);
    expect(document.querySelectorAll("img")).toHaveLength(3);
    expect(document.querySelectorAll("img")[1]).toHaveAttribute("loading", "lazy");
    fireEvent.focus(region());
    expect(document.querySelectorAll("img")).toHaveLength(8);
  });

  it("overlays stand in their corners, several of a corner in their order", () => {
    render(
      <Carousel.Root items={PHOTOS}>
        <Carousel.Overlay data-testid="status">На линии</Carousel.Overlay>
        <Carousel.Overlay placement="top-end" data-testid="new">
          Новинка
        </Carousel.Overlay>
        <Carousel.Overlay placement="bottom-start" data-testid="plate">
          А 123 ВС
        </Carousel.Overlay>
        <Carousel.Overlay placement="bottom-end" data-testid="count">
          4 фото
        </Carousel.Overlay>
        <Carousel.Overlay data-testid="rent">Аренда</Carousel.Overlay>
      </Carousel.Root>,
    );
    const corner = (placement: string) =>
      document.querySelector(`[data-placement="${placement}"]:not([data-testid])`) as HTMLElement;
    expect(corner("top-start")).toContainElement(screen.getByTestId("status"));
    expect(screen.getByTestId("status").nextElementSibling).toBe(screen.getByTestId("rent"));
    expect(corner("top-end")).toContainElement(screen.getByTestId("new"));
    expect(corner("bottom-start")).toContainElement(screen.getByTestId("plate"));
    expect(corner("bottom-end")).toContainElement(screen.getByTestId("count"));
  });

  it("an overlay that does not fit beside the ones before it steps aside", () => {
    vi.spyOn(HTMLElement.prototype, "offsetParent", "get").mockReturnValue(document.body);
    vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.testid === "rent" ? 28 : 0;
    });
    render(
      <Carousel.Root items={PHOTOS}>
        <Carousel.Overlay data-testid="status">На линии</Carousel.Overlay>
        <Carousel.Overlay data-testid="rent">Аренда</Carousel.Overlay>
      </Carousel.Root>,
    );
    expect(screen.getByTestId("status")).not.toHaveAttribute("data-hidden");
    expect(screen.getByTestId("rent")).toHaveAttribute("data-hidden", "true");
    expect(screen.getByTestId("rent").inert).toBe(true);
  });

  it("takes the shared ratios, 16:10 among them", () => {
    render(<Carousel.Root items={PHOTOS} ratio="16:10" />);
    expect(region()).toHaveAttribute("data-ratio", "16:10");
    expect(cssValue(cssRule(CSS, '.root[data-ratio="16:10"]'), "--carousel-ratio")).toBe("16 / 10");
  });

  it("a corner beside an empty one takes the whole edge; the dots keep the bottom in halves", () => {
    // Each corner's track grows to its row; with the opposite empty, no gap is left beside it.
    expect(cssValue(cssRule(CSS, '.edge[data-split="share"]'), "grid-template-columns")).toBe(
      "minmax(0, auto) minmax(0, auto)",
    );
    expect(
      cssValue(cssRule(CSS, '.edge[data-split="share"]:has(> .corner:empty)'), "column-gap"),
    ).toBe("var(--prime-space-0)");
    const edge = (name: string) =>
      document.querySelector(`[data-layer="carousel"] [data-edge="${name}"]`);
    const { rerender } = render(
      <Carousel.Root items={PHOTOS}>
        <Carousel.Overlay>Возврат просрочен</Carousel.Overlay>
      </Carousel.Root>,
    );
    expect(edge("top")).toHaveAttribute("data-split", "share");
    expect(edge("bottom")).toHaveAttribute("data-split", "half");
    rerender(
      <Carousel.Root items={PHOTOS} dots={false}>
        <Carousel.Overlay placement="bottom-start">А 123 ВС</Carousel.Overlay>
      </Carousel.Root>,
    );
    expect(edge("bottom")).toHaveAttribute("data-split", "share");
  });

  it("an edge where the carousel's and a slide's overlays both stand splits in halves", () => {
    render(
      <Carousel.Root
        items={PHOTOS}
        renderOverlay={() => <Carousel.Overlay placement="top-end">Царапина</Carousel.Overlay>}
      >
        <Carousel.Overlay>Возврат просрочен</Carousel.Overlay>
      </Carousel.Root>,
    );
    for (const edge of document.querySelectorAll('[data-edge="top"]')) {
      expect(edge).toHaveAttribute("data-split", "half");
    }
  });

  it("an overlay lets the swipe and the scrub through", async () => {
    stubMedia("(hover: hover)", "prefers-reduced-motion");
    const onIndexChange = vi.fn();
    render(
      <Carousel.Root items={PHOTOS} scrub onIndexChange={onIndexChange}>
        <Carousel.Overlay data-testid="status">На линии</Carousel.Overlay>
      </Carousel.Root>,
    );
    const badge = screen.getByTestId("status");
    swipe(badge, 300, 60);
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    await act(() => new Promise((resolve) => setTimeout(resolve, HOVER_SETTLE_MS + 20)));
    pointer(badge, "pointermove", { x: 390, pointerType: "mouse" });
    expect(onIndexChange).toHaveBeenLastCalledWith(3);
  });
});

describe("Carousel dots", () => {
  it("the pill covers its dot, stretches to the next over the first half and follows over the second", () => {
    expect(indicatorSpan(1, 5, false)).toEqual({ start: 1, end: 2 });
    expect(indicatorSpan(1.25, 5, false)).toEqual({ start: 1, end: 2.5 });
    expect(indicatorSpan(1.5, 5, false)).toEqual({ start: 1, end: 3 });
    expect(indicatorSpan(1.75, 5, false)).toEqual({ start: 1.5, end: 3 });
    expect(indicatorSpan(2, 5, false)).toEqual({ start: 2, end: 3 });
  });

  it("holds at an end without loop and jumps at the seam of a loop", () => {
    expect(indicatorSpan(-0.3, 5, false)).toEqual({ start: 0, end: 1 });
    expect(indicatorSpan(4.4, 5, false)).toEqual({ start: 4, end: 5 });
    expect(indicatorSpan(4.3, 5, true)).toEqual({ start: 4, end: 5 });
    expect(indicatorSpan(4.7, 5, true)).toEqual({ start: 0, end: 1 });
    expect(indicatorSpan(-0.3, 5, true)).toEqual({ start: 0, end: 1 });
  });

  it("follows the finger frame by frame without a render", async () => {
    stubMedia();
    vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      const dots = Array.from(this.parentElement?.querySelectorAll("[data-carousel-dot]") ?? []);
      return dots.indexOf(this) * 16;
    });
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(16);
    let renders = 0;
    render(
      <React.Profiler id="carousel" onRender={() => renders++}>
        <Carousel.Root items={PHOTOS} />
      </React.Profiler>,
    );
    const pill = document.querySelector("[data-carousel-dot]")?.parentElement
      ?.lastElementChild as HTMLElement;
    expect(pill.style.transform).toBe("translateX(0px)");
    expect(pill.style.width).toBe("16px");
    const root = region();
    pointer(root, "pointerdown", { x: 300 });
    pointer(root, "pointermove", { x: 290, t: 10 });
    const before = renders;
    // A quarter of the way to the next slide: the pill reaches half way to the next dot.
    pointer(root, "pointermove", { x: 290 - WIDTH / 4, t: 20 });
    await nextFrame();
    expect(pill.style.width).toBe("24px");
    pointer(root, "pointermove", { x: 290 - (WIDTH * 3) / 4, t: 30 });
    await nextFrame();
    expect(pill.style.transform).toBe("translateX(8px)");
    expect(renders).toBe(before);
  });

  it("dots={false} leaves the dots and their fade out; the keys and the announcement stay", async () => {
    const user = userEvent.setup();
    render(<Carousel.Root items={PHOTOS} dots={false} />);
    expect(document.querySelector("[data-carousel-dot]")).toBeNull();
    expect(document.querySelector(`.${pill.fade}`)).toBeNull();
    region().focus();
    await user.keyboard("{ArrowRight}");
    expect(currentSlide()).toHaveAccessibleName("Фото 2 из 4");
    expect(screen.getByRole("status")).toHaveTextContent("Фото 2 из 4");
  });
});

describe("Carousel slide overlays", () => {
  const renderOverlay = (item: CarouselItem) =>
    item.src === "/side.jpg" ? (
      <Carousel.Overlay data-testid="scratch">Царапина на крыле</Carousel.Overlay>
    ) : null;

  it("a slide's overlay is on its slide and travels with it under the finger", async () => {
    render(<Carousel.Root items={PHOTOS} defaultIndex={1} renderOverlay={renderOverlay} />);
    const scratch = screen.getByTestId("scratch");
    const slide = scratch.closest('[aria-roledescription="слайд"]') as HTMLElement;
    expect(slide).toBe(currentSlide());
    const root = region();
    pointer(root, "pointerdown", { x: 300 });
    pointer(root, "pointermove", { x: 290, t: 10 });
    pointer(root, "pointermove", { x: 200, t: 20 });
    await nextFrame();
    expect(slide.style.transform).toBe("translate3d(calc(0% + -90px), 0, 0)");
    pointer(root, "pointerup", { x: 200, t: 400 });
  });

  it("the carousel's overlay stays put and leads the shared corner; the slide's comes and goes", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root items={PHOTOS} renderOverlay={renderOverlay}>
        <Carousel.Overlay data-testid="status">На линии</Carousel.Overlay>
      </Carousel.Root>,
    );
    const status = screen.getByTestId("status");
    expect(status.closest('[data-layer="carousel"]')).not.toBeNull();
    expect(screen.getByTestId("scratch").closest('[data-layer="slide"]')).not.toBeNull();
    // The slide's corner continues the carousel's row after what it takes.
    expect(region().style.getPropertyValue("--carousel-taken-top-start")).not.toBe("");
    expect(screen.getByTestId("scratch").closest('[aria-hidden="true"]')).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Фото 2 из 4" }));
    expect(screen.getByTestId("scratch").closest('[aria-hidden="true"]')).toBeNull();
    expect(screen.getByTestId("status")).toBe(status);
  });

  it("a slide that arrives at once (a scrub) fades its overlays in", async () => {
    stubMedia("(hover: hover)");
    render(<Carousel.Root items={PHOTOS} scrub renderOverlay={renderOverlay} />);
    const root = region();
    await act(() => new Promise((resolve) => setTimeout(resolve, HOVER_SETTLE_MS + 20)));
    pointer(root, "pointerenter", { x: 150, pointerType: "mouse" });
    pointer(root, "pointermove", { x: 150, pointerType: "mouse" });
    expect(screen.getByTestId("scratch").closest('[data-layer="slide"]')).toHaveClass(
      enterMotion.enterFade as string,
    );
  });
});

describe("Carousel video", () => {
  const MIXED: CarouselItem[] = [
    { type: "video", src: "/clip.mp4", autoPlay: true, alt: "Ролик" },
    { src: "/side.jpg", alt: "Сбоку" },
    { type: "video", src: "/walk.mp4", poster: "/walk.jpg", duration: 42, alt: "Обзор" },
  ];
  let play: Mock<(this: HTMLMediaElement) => Promise<void>>;
  let pause: Mock<(this: HTMLMediaElement) => void>;
  let observers: { near: boolean; notify: (visible: boolean) => void }[];
  /** The carousel came half a view near: the media mount. */
  const comeNear = () => {
    for (const observer of observers) if (observer.near) observer.notify(true);
  };
  /** The carousel came into the view (or left it). */
  const observed = (visible: boolean) => {
    for (const observer of observers) if (!observer.near) observer.notify(visible);
  };

  beforeEach(() => {
    observers = [];
    play = vi.fn(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    });
    pause = vi.fn(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event("pause"));
    });
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pause);
    vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockReturnValue(false);
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          observers.push({
            near: options?.rootMargin !== undefined,
            notify: (visible) =>
              act(() =>
                callback(
                  [{ isIntersecting: visible } as IntersectionObserverEntry],
                  this as unknown as IntersectionObserver,
                ),
              ),
          });
        }
        observe() {}
        disconnect() {}
      },
    );
    stubMedia();
  });

  it("an autoPlay clip plays muted only while current and in view, and pauses when swiped away", () => {
    render(<Carousel.Root items={MIXED} />);
    expect(document.querySelector("video")).toBeNull();
    comeNear();
    const clip = document.querySelector('video[aria-label="Ролик"]') as HTMLVideoElement;
    expect(clip.muted).toBe(true);
    expect(clip.loop).toBe(true);
    expect(play).not.toHaveBeenCalled();
    observed(true);
    expect(play).toHaveBeenCalledTimes(1);
    // The sound button stands in the bottom-end corner with the overlays.
    expect(document.querySelector('[data-placement="bottom-end"]')).toContainElement(
      screen.getByRole("button", { name: "Включить звук" }),
    );
    swipe(region(), 300, 60);
    expect(pause).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Включить звук" })).not.toBeInTheDocument();
  });

  it("pauses when the carousel leaves the view", () => {
    render(<Carousel.Root items={MIXED} />);
    comeNear();
    observed(true);
    expect(play).toHaveBeenCalledTimes(1);
    observed(false);
    expect(pause).toHaveBeenCalled();
  });

  it("the sound button gives the clip its sound and takes it back", async () => {
    const user = userEvent.setup();
    render(<Carousel.Root items={MIXED} />);
    comeNear();
    observed(true);
    const clip = document.querySelector('video[aria-label="Ролик"]') as HTMLVideoElement;
    await user.click(screen.getByRole("button", { name: "Включить звук" }));
    expect(clip.muted).toBe(false);
    await user.click(screen.getByRole("button", { name: "Выключить звук" }));
    expect(clip.muted).toBe(true);
  });

  it("a clip without loop stops on its last frame under the play mark", () => {
    render(
      <Carousel.Root items={[{ ...(MIXED[0] as CarouselItem), loop: false }, ...MIXED.slice(1)]} />,
    );
    comeNear();
    observed(true);
    const clip = document.querySelector('video[aria-label="Ролик"]') as HTMLVideoElement;
    expect(clip.loop).toBe(false);
    act(() => {
      clip.dispatchEvent(new Event("ended"));
    });
    expect(screen.queryByRole("button", { name: "Включить звук" })).not.toBeInTheDocument();
  });

  it("a video without autoPlay stands still with its poster and its length", () => {
    render(<Carousel.Root items={MIXED} defaultIndex={2} />);
    comeNear();
    observed(true);
    const walk = document.querySelector('video[aria-label="Обзор"]') as HTMLVideoElement;
    expect(walk).toHaveAttribute("poster", "/walk.jpg");
    expect(walk).toHaveAttribute("preload", "metadata");
    expect(play).not.toHaveBeenCalled();
    expect(screen.getByText("0:42")).toBeInTheDocument();
    expect(currentSlide()).toHaveAccessibleName("Видео 3 из 3");
  });

  it("never plays by itself under reduced motion", () => {
    stubMedia("prefers-reduced-motion");
    render(<Carousel.Root items={MIXED} />);
    comeNear();
    observed(true);
    expect(play).not.toHaveBeenCalled();
  });
});
