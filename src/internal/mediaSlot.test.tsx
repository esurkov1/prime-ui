import { render, screen } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";

import { useMediaSlotHost, useMediaSlotSize } from "./mediaSlot";

function Host({ children }: { children: React.ReactNode }) {
  const { media, provide } = useMediaSlotHost();
  return (
    <div data-testid="host" data-media={media ? "true" : undefined}>
      {provide(children)}
    </div>
  );
}

function Picture({ kind }: { kind: "avatar" | "thumbnail" }) {
  return <span data-testid={kind} data-size={useMediaSlotSize(kind) ?? "own"} />;
}

describe("mediaSlot", () => {
  it("a picture deep inside the slot reports itself and takes the slot's size", () => {
    render(
      <Host>
        <span>
          <Picture kind="avatar" />
        </span>
      </Host>,
    );
    expect(screen.getByTestId("host")).toHaveAttribute("data-media", "true");
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "l");
  });

  it("a thumbnail takes `m`; outside a slot a picture keeps its own size", () => {
    render(
      <>
        <Host>
          <Picture kind="thumbnail" />
        </Host>
        <Picture kind="avatar" />
      </>,
    );
    expect(screen.getByTestId("thumbnail")).toHaveAttribute("data-size", "m");
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "own");
  });

  it("a host of another box gives its own sizes; a kind it leaves out keeps the picture's size", () => {
    function ChipHost({ children }: { children: React.ReactNode }) {
      return useMediaSlotHost({ avatar: "2xs" }).provide(children);
    }
    render(
      <ChipHost>
        <Picture kind="avatar" />
        <Picture kind="thumbnail" />
      </ChipHost>,
    );
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "2xs");
    expect(screen.getByTestId("thumbnail")).toHaveAttribute("data-size", "own");
  });

  it("a ring reports itself as a named mark and keeps its own size", () => {
    function NamedHost({ children }: { children: React.ReactNode }) {
      const { media, named, provide } = useMediaSlotHost();
      return (
        <div data-testid="host" data-media={media || undefined} data-named={named || undefined}>
          {provide(children)}
        </div>
      );
    }
    function Ring() {
      return <span data-testid="ring" data-size={useMediaSlotSize("ring") ?? "own"} />;
    }
    const { rerender } = render(
      <NamedHost>
        <Ring />
      </NamedHost>,
    );
    expect(screen.getByTestId("host")).toHaveAttribute("data-media", "true");
    expect(screen.getByTestId("host")).toHaveAttribute("data-named", "true");
    expect(screen.getByTestId("ring")).toHaveAttribute("data-size", "own");
    rerender(
      <NamedHost>
        <Picture kind="avatar" />
      </NamedHost>,
    );
    expect(screen.getByTestId("host")).toHaveAttribute("data-media", "true");
    expect(screen.getByTestId("host")).not.toHaveAttribute("data-named");
  });

  it("is no media slot without a picture, and stops being one when it leaves", () => {
    const { rerender } = render(
      <Host>
        <Picture kind="avatar" />
      </Host>,
    );
    expect(screen.getByTestId("host")).toHaveAttribute("data-media", "true");
    rerender(
      <Host>
        <svg />
      </Host>,
    );
    expect(screen.getByTestId("host")).not.toHaveAttribute("data-media");
  });
});
