import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, type AvatarSize } from "./Avatar";
import styles from "./Avatar.module.css";

const sizes: AvatarSize[] = ["s", "m", "l", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];

describe("Avatar", () => {
  it("renders image with src and alt", () => {
    render(
      <Avatar.Root>
        <Avatar.Image src="https://example.com/a.png" alt="User" />
        <Avatar.Fallback>U</Avatar.Fallback>
      </Avatar.Root>,
    );
    const img = screen.getByRole("img", { name: "User" });
    expect(img).toHaveAttribute("src", "https://example.com/a.png");
  });

  it('sets data-status="loaded" after load', () => {
    const { container } = render(
      <Avatar.Root>
        <Avatar.Image src="https://example.com/a.png" alt="" />
        <Avatar.Fallback>F</Avatar.Fallback>
      </Avatar.Root>,
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("data-status", "loading");
    fireEvent.load(img as HTMLImageElement);
    expect(img).toHaveAttribute("data-status", "loaded");
  });

  it('sets data-status="error" on error', () => {
    const { container } = render(
      <Avatar.Root>
        <Avatar.Image src="https://example.com/broken.png" alt="" />
        <Avatar.Fallback>FB</Avatar.Fallback>
      </Avatar.Root>,
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    fireEvent.error(img as HTMLImageElement);
    expect(img).toHaveAttribute("data-status", "error");
  });

  it("shows fallback when there is no image", () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByText("AB")).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
  });

  it.each(sizes)("sets data-size=%s on Root", (size) => {
    render(
      <Avatar.Root size={size}>
        <Avatar.Fallback>x</Avatar.Fallback>
      </Avatar.Root>,
    );
    const root = screen.getByText("x").closest("div");
    expect(root).toHaveAttribute("data-size", size);
  });

  it("merges className on Root", () => {
    render(
      <Avatar.Root className="avatar-custom">
        <Avatar.Fallback>Z</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByText("Z").closest("div")).toHaveClass("avatar-custom");
  });
});

describe("Avatar.Group", () => {
  it("renders avatars in group container", () => {
    const { container } = render(
      <Avatar.Group.Root>
        <Avatar.Root>
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>B</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>C</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group.Root>,
    );
    expect(container.querySelector(`.${styles.groupRoot}`)).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("injects size from Group.Root into avatars and overflow", () => {
    render(
      <Avatar.Group.Root size="s" data-testid="group-root">
        <Avatar.Root data-testid="a">
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Group.Overflow data-testid="ov">+3</Avatar.Group.Overflow>
      </Avatar.Group.Root>,
    );
    expect(screen.getByTestId("group-root")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("a")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("ov")).toHaveAttribute("data-size", "s");
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("does not override explicit size on Avatar.Root", () => {
    render(
      <Avatar.Group.Root size="s">
        <Avatar.Root size="xl" data-testid="a">
          <Avatar.Fallback>X</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group.Root>,
    );
    expect(screen.getByTestId("a")).toHaveAttribute("data-size", "xl");
  });

  it("merges className on Group.Root", () => {
    const { container } = render(
      <Avatar.Group.Root className="group-custom">
        <Avatar.Root>
          <Avatar.Fallback>X</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group.Root>,
    );
    expect(container.querySelector(".group-custom")).toBeInTheDocument();
  });
});
