import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Icon } from "@/icons";
import { cssRule, cssValue } from "@/test/css";

import { ListRowControls, ListRowMark, listRowStyles } from "./listRow";

const CSS = "src/internal/listRow.module.css";

describe("listRow", () => {
  it("sizes a picture under the row beside one line and as tall as two lines beside a description", () => {
    render(
      <>
        <ListRowMark size="m" lines="line">
          <Avatar.Root data-testid="line">
            <Avatar.Fallback>ИБ</Avatar.Fallback>
          </Avatar.Root>
        </ListRowMark>
        <ListRowMark size="m" lines="two">
          <Avatar.Root data-testid="two">
            <Avatar.Fallback>ПО</Avatar.Fallback>
          </Avatar.Root>
        </ListRowMark>
        <ListRowMark size="xl" lines="line">
          <ProgressCircle value={50} aria-label="Срок: 50%" data-testid="ring" />
        </ListRowMark>
        <ListRowMark size="m" lines="line">
          <Avatar.Root size="xs" data-testid="own">
            <Avatar.Fallback>СК</Avatar.Fallback>
          </Avatar.Root>
        </ListRowMark>
      </>,
    );
    expect(screen.getByTestId("line")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("two")).toHaveAttribute("data-size", "l");
    expect(screen.getByTestId("ring")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("own")).toHaveAttribute("data-size", "xs");
  });

  it("puts a glyph beside two lines on a tile; a dot stands in an icon-wide box", () => {
    render(
      <>
        <ListRowMark size="m" lines="two" tone="accent" data-testid="tile">
          <Icon name="object.file" />
        </ListRowMark>
        <ListRowMark size="m" lines="line" data-testid="glyph">
          <Icon name="object.file" />
        </ListRowMark>
        <ListRowMark size="m" lines="line" data-testid="dot">
          <Badge.Dot color="purple" />
        </ListRowMark>
      </>,
    );
    expect(screen.getByTestId("tile")).toHaveAttribute("data-kind", "tile");
    expect(screen.getByTestId("tile")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("tile")).toHaveAttribute("data-tone", "accent");
    expect(screen.getByTestId("glyph")).toHaveAttribute("data-kind", "glyph");
    expect(screen.getByTestId("dot")).toHaveAttribute("data-kind", "dot");
    expect(cssValue(cssRule(CSS, ".mark"), "--prime-icon-size")).toBe("var(--field-icon)");
  });

  it("gives the row's controls the row minus 8, a tier down beside a description", () => {
    render(
      <>
        <ListRowControls size="m" lines="line">
          <Button.Root data-testid="line">Скачать</Button.Root>
        </ListRowControls>
        <ListRowControls size="m" lines="two">
          <Button.Root data-testid="two">Скачать</Button.Root>
        </ListRowControls>
      </>,
    );
    expect(screen.getByTestId("line")).toHaveAttribute("data-size", "xs");
    expect(screen.getByTestId("two")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("line").parentElement).toHaveClass(listRowStyles.actions);
    const two = cssRule(CSS, '.row[data-lines="two"] > .actions');
    expect(cssValue(two, "--prime-control-height")).toBe("initial");
  });
});
