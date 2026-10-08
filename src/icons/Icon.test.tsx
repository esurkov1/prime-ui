import { fireEvent, render, screen } from "@testing-library/react";
import * as lucide from "lucide-react";
import { Bike } from "lucide-react";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { iconBoxStyles } from "@/internal/iconBox";
import * as iconSet from "../icon-set";
import type { Glyph } from "./glyph";
import { createIcon, Icon, type IconName } from "./index";
import { iconRegistry } from "./registry";

describe("Icon", () => {
  it("renders every registry name as a hidden svg", () => {
    for (const name of Object.keys(iconRegistry) as IconName[]) {
      const { container, unmount } = render(<Icon name={name} />);
      const svg = container.querySelector("svg");
      expect(svg, name).not.toBeNull();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      unmount();
    }
  });

  it("explicit size uses the global icon scale", () => {
    render(<Icon name="action.close" size="l" data-testid="i" />);
    const el = screen.getByTestId("i");
    expect(el).toHaveClass(iconBoxStyles.l);
    expect(el).not.toHaveClass(iconBoxStyles.inherit);
  });

  it("without size follows the nearest control tier", () => {
    render(
      <ControlSizeProvider value="xs">
        <Icon name="action.close" data-testid="i" />
      </ControlSizeProvider>,
    );
    const el = screen.getByTestId("i");
    expect(el).toHaveClass(iconBoxStyles.xs);
    expect(el).toHaveClass(iconBoxStyles.inherit);
  });

  it("defaults to the m control icon outside any control", () => {
    render(<Icon name="action.close" data-testid="i" />);
    const el = screen.getByTestId("i");
    expect(el).toHaveClass(iconBoxStyles.m);
    expect(el).toHaveClass(iconBoxStyles.inherit);
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards ref to the svg and sets data-tone only for a non-default tone", () => {
    const ref = { current: null as SVGSVGElement | null };
    const { rerender } = render(<Icon name="action.close" ref={ref} data-testid="i" />);
    expect(ref.current).toBe(screen.getByTestId("i"));
    expect(screen.getByTestId("i")).not.toHaveAttribute("data-tone");
    rerender(<Icon name="action.close" tone="danger" data-testid="i" />);
    expect(screen.getByTestId("i")).toHaveAttribute("data-tone", "danger");
  });
});

describe("createIcon", () => {
  const IconBike = createIcon(Bike);

  it("gives a domain glyph the kit sizing, tone and hidden state", () => {
    render(
      <ControlSizeProvider value="l">
        <IconBike tone="muted" data-testid="bike" />
      </ControlSizeProvider>,
    );
    const el = screen.getByTestId("bike");
    expect(el.tagName.toLowerCase()).toBe("svg");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveAttribute("data-tone", "muted");
    expect(el).toHaveClass(iconBoxStyles.l);
    expect(el).toHaveClass(iconBoxStyles.inherit);
  });
});

describe("icon gestures", () => {
  /** Motion allowed: the test setup reports reduced motion by default. */
  function allowMotion() {
    return vi
      .spyOn(window, "matchMedia")
      .mockImplementation((query: string) => ({ matches: false, media: query }) as MediaQueryList);
  }
  const hover = (el: Element, pointerType = "mouse") => fireEvent.pointerOver(el, { pointerType });

  afterEach(() => {
    hover(document.body);
    vi.restoreAllMocks();
  });

  it("marks a glyph as animated unless `animated={false}`", () => {
    const { rerender } = render(<Icon name="action.search" data-testid="i" />);
    expect(screen.getByTestId("i")).toHaveAttribute("data-icon-motion", "glyph");
    rerender(<Icon name="action.search" animated={false} data-testid="i" />);
    expect(screen.getByTestId("i")).not.toHaveAttribute("data-icon-motion");
  });

  it("plays once when its host is hovered and clears when the carrier ends", () => {
    allowMotion();
    render(
      <button type="button">
        <Icon name="action.add" data-testid="i" />
        Добавить
      </button>,
    );
    const icon = screen.getByTestId("i");
    hover(screen.getByRole("button"));
    expect(icon).toHaveAttribute("data-play");
    fireEvent.animationEnd(icon);
    expect(icon).not.toHaveAttribute("data-play");
    hover(icon);
    expect(icon, "moving inside the same host does not replay").not.toHaveAttribute("data-play");
  });

  it("plays only the icons that belong to the hovered host", () => {
    allowMotion();
    render(
      <a href="/orders">
        <Icon name="object.package" data-testid="outer" />
        Заказы
        <button type="button" aria-label="Удалить">
          <Icon name="action.delete" data-testid="inner" />
        </button>
      </a>,
    );
    hover(screen.getByRole("link"));
    expect(screen.getByTestId("outer")).toHaveAttribute("data-play");
    expect(screen.getByTestId("inner")).not.toHaveAttribute("data-play");
  });

  it("stays still in disabled hosts, on keyboard focus, without motion and for touch hover", () => {
    const motion = allowMotion();
    render(
      <>
        <button type="button" disabled>
          <Icon name="action.add" data-testid="disabled" />
        </button>
        <div role="option" aria-selected="false" tabIndex={-1}>
          <Icon name="action.check" data-testid="option" />
        </div>
        <button type="button" data-testid="host">
          <Icon name="action.copy" data-testid="copy" />
        </button>
      </>,
    );
    hover(screen.getByTestId("disabled"));
    fireEvent.focus(screen.getByRole("option"));
    hover(screen.getByTestId("host"), "touch");
    expect(screen.getByTestId("disabled")).not.toHaveAttribute("data-play");
    expect(screen.getByTestId("option")).not.toHaveAttribute("data-play");
    hover(screen.getByRole("option"));
    expect(screen.getByTestId("option"), "menu rows play on pointer hover").toHaveAttribute(
      "data-play",
    );
    expect(screen.getByTestId("copy")).not.toHaveAttribute("data-play");

    fireEvent.pointerDown(screen.getByTestId("host"), { pointerType: "touch" });
    expect(screen.getByTestId("copy"), "a touch press plays").toHaveAttribute("data-play");
    fireEvent.animationEnd(screen.getByTestId("copy"));

    motion.mockImplementation(
      (query: string) => ({ matches: query.includes("reduce"), media: query }) as MediaQueryList,
    );
    hover(document.body);
    hover(screen.getByTestId("host"));
    expect(screen.getByTestId("copy"), "reduced motion").not.toHaveAttribute("data-play");
  });

  it("plays a lone icon when the icon itself is hovered", () => {
    allowMotion();
    render(<Icon name="object.bell" data-testid="i" />);
    hover(screen.getByTestId("i"));
    expect(screen.getByTestId("i")).toHaveAttribute("data-play");
  });

  it("gives a createIcon glyph the generic gesture", () => {
    const IconBike = createIcon(Bike);
    render(<IconBike data-testid="bike" />);
    expect(screen.getByTestId("bike")).toHaveAttribute("data-icon-motion", "generic");
  });

  it("draws every registry glyph from a Lucide source", () => {
    for (const [name, glyph] of Object.entries(iconRegistry)) {
      expect((lucide as Record<string, unknown>)[glyph.source], name).toBeDefined();
    }
  });
});

describe("glyph drawings", () => {
  /** Drawing elements of an svg as `tag attr=value…`, gesture markup left out, in a stable order. */
  function drawing(svg: SVGSVGElement): string[] {
    return [...svg.querySelectorAll(":not(g)")]
      .map((el) =>
        [
          el.tagName,
          ...[...el.attributes]
            .filter((a) => !a.name.startsWith("data-") && a.name !== "pathLength")
            .map((a) => `${a.name}=${a.value}`)
            .sort(),
        ].join(" "),
      )
      .sort();
  }

  /** Every glyph file: the kit set and the docs-only glyphs of the playground. */
  const modules = import.meta.glob<Record<string, Glyph>>(
    ["./glyphs/*.tsx", "../../playground/icons/glyphs/*.tsx"],
    { eager: true },
  );
  const glyphs: [string, Glyph][] = Object.entries(modules).flatMap(([file, exports]) =>
    Object.values(exports).map((glyph): [string, Glyph] => [file.replace(/^.*\//, ""), glyph]),
  );

  it.each(glyphs)("%s is the Lucide drawing at rest with one gesture", (_, Glyph) => {
    const Lucide = (lucide as unknown as Record<string, React.ComponentType>)[Glyph.source];
    const ours = render(<Glyph />).container.querySelector("svg");
    const theirs = render(<Lucide />).container.querySelector("svg");
    if (!ours || !theirs) throw new Error("no svg");
    expect(drawing(ours)).toEqual(drawing(theirs));
    expect(ours.querySelector("[data-motion]"), "has a gesture").not.toBeNull();
    for (const part of ours.querySelectorAll('[data-motion="draw"]')) {
      expect(part.getAttribute("pathLength"), "draw needs pathLength=1").toBe("1");
    }
  });
});

describe("prime-ui-kit/icons", () => {
  const files = import.meta.glob<Record<string, Glyph>>("./glyphs/*.tsx", { eager: true });

  it("exports every kit glyph file as <Name>Icon (run `bun run icons:add` after adding one)", () => {
    const expected = Object.values(files)
      .flatMap((exports) => Object.entries(exports))
      .map(([name, glyph]) => [`${name}Icon`, glyph] as const)
      .sort(([a], [b]) => a.localeCompare(b));
    const actual = Object.entries(iconSet)
      .filter(([, value]) => typeof value === "function")
      .sort(([a], [b]) => a.localeCompare(b));
    expect(actual).toEqual(expected);
  });
});
