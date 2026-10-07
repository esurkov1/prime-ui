import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Thumbnail } from "./Thumbnail";

describe("Thumbnail", () => {
  it("exposes size, ratio and color as data attributes with defaults m · 1:1 · gray", () => {
    const { container, rerender } = render(<Thumbnail.Root />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-size", "m");
    expect(root).toHaveAttribute("data-ratio", "1:1");
    expect(root).toHaveAttribute("data-color", "gray");
    expect(root).toHaveAttribute("data-variant", "soft");
    rerender(<Thumbnail.Root size="l" ratio="16:9" color="red" variant="solid" fullWidth />);
    expect(root).toHaveAttribute("data-variant", "solid");
    expect(root).toHaveAttribute("data-ratio", "16:9");
    expect(root).toHaveAttribute("data-color", "red");
    expect(root).toHaveAttribute("data-full-width", "true");
  });

  it("shows the image once loaded and hides the fallback from assistive tech", () => {
    render(
      <Thumbnail.Root>
        <Thumbnail.Image src="/bike.jpg" alt="Honda ADV 350" />
        <Thumbnail.Fallback data-testid="fallback">B</Thumbnail.Fallback>
      </Thumbnail.Root>,
    );
    const image = screen.getByRole("img", { name: "Honda ADV 350" });
    expect(image).toHaveAttribute("data-status", "loading");
    fireEvent.load(image);
    expect(image).toHaveAttribute("data-status", "loaded");
    expect(screen.getByTestId("fallback")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the fallback visible when the image fails", () => {
    render(
      <Thumbnail.Root>
        <Thumbnail.Image src="/missing.jpg" alt="" />
        <Thumbnail.Fallback data-testid="fallback">B</Thumbnail.Fallback>
      </Thumbnail.Root>,
    );
    const image = document.querySelector("img") as HTMLImageElement;
    fireEvent.error(image);
    expect(image).toHaveAttribute("data-status", "error");
    expect(screen.getByTestId("fallback")).not.toHaveAttribute("aria-hidden");
  });

  it("passes fit to the image", () => {
    render(
      <Thumbnail.Root>
        <Thumbnail.Image src="/logo.png" alt="Логотип" fit="contain" />
      </Thumbnail.Root>,
    );
    expect(screen.getByRole("img", { name: "Логотип" })).toHaveAttribute("data-fit", "contain");
  });
});
