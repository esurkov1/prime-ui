/**
 * The shared conformance suite of the layer-stack overlays (foundation §8): opened from its
 * trigger, focus moves into the layer; a modal layer keeps Tab inside; Escape closes it; focus
 * returns to the trigger. An overlay's own test file calls `describeOverlayConformance` with how
 * to render it closed:
 *
 * ```tsx
 * describeOverlayConformance("Modal", {
 *   render: () => <MyModal />, // a closed overlay and a trigger button named «Открыть»
 *   trigger: "Открыть",
 *   role: "dialog",
 *   modal: true,
 * });
 * ```
 *
 * Built on `src/internal/overlay/focus.ts` (`getFocusable`): the same notion of a tab stop as the
 * focus trap the kit ships.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it } from "vitest";

import { getFocusable } from "@/internal/overlay/focus";

export type OverlayConformanceOptions = {
  /** Renders the overlay closed, with a trigger button named `trigger`. */
  render: () => React.ReactElement;
  /** The accessible name of the trigger button. */
  trigger: string;
  /** The role of the opened layer (`dialog`, `alertdialog`, `menu`, `listbox`). */
  role: string;
  /** A modal layer traps Tab and Shift+Tab inside. */
  modal?: boolean;
};

async function open({ render: ui, trigger, role }: OverlayConformanceOptions) {
  const user = userEvent.setup();
  render(ui());
  const opener = screen.getByRole("button", { name: trigger });
  await user.click(opener);
  const layer = await screen.findByRole(role);
  return { user, opener, layer };
}

/** Registers the conformance tests of one overlay. */
export function describeOverlayConformance(name: string, options: OverlayConformanceOptions) {
  describe(`${name}: overlay conformance`, () => {
    it("moves focus into the layer when it opens", async () => {
      const { layer } = await open(options);
      await waitFor(() => expect(layer.contains(document.activeElement)).toBe(true));
    });

    it.runIf(options.modal)("keeps Tab and Shift+Tab inside a modal layer", async () => {
      const { user, layer } = await open(options);
      await waitFor(() => expect(layer.contains(document.activeElement)).toBe(true));
      const stops = getFocusable(layer).length;
      for (let i = 0; i <= stops; i += 1) {
        await user.tab();
        expect(layer.contains(document.activeElement), `Tab ${i + 1}`).toBe(true);
      }
      for (let i = 0; i <= stops; i += 1) {
        await user.tab({ shift: true });
        expect(layer.contains(document.activeElement), `Shift+Tab ${i + 1}`).toBe(true);
      }
    });

    it("closes on Escape and returns focus to the trigger", async () => {
      const { user, opener } = await open(options);
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole(options.role)).toBeNull());
      await waitFor(() => expect(document.activeElement).toBe(opener));
    });
  });
}
