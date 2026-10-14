import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";
import type { ControlSize } from "@/internal/states";

import { DialogBody, DialogConfirm, DialogFooter } from "./DialogParts";
import { ModalContent, type ModalPlacement, ModalRoot, type ModalRootProps } from "./ModalDialog";

function Dialog({
  size,
  placement,
  onConfirm,
  ...root
}: Omit<ModalRootProps, "children"> & {
  size?: ControlSize;
  placement?: ModalPlacement;
  onConfirm?: () => void;
}) {
  return (
    <ModalRoot defaultOpen {...root}>
      <ModalContent size={size} placement={placement} aria-label="Новый проект">
        <DialogBody>
          <input aria-label="Название" />
        </DialogBody>
        <DialogFooter data-testid="footer">
          <DialogConfirm>
            <Button.Root onClick={onConfirm}>Создать</Button.Root>
          </DialogConfirm>
        </DialogFooter>
      </ModalContent>
    </ModalRoot>
  );
}

describe("ModalDialog", () => {
  it("stands centred at the `m` width tier by default", () => {
    render(<Dialog />);
    const dialog = screen.getByRole("dialog", { name: "Новый проект" });
    expect(dialog).toHaveAttribute("data-size", "m");
    expect(dialog).toHaveAttribute("data-placement", "center");
    expect(dialog).toHaveAttribute("data-kind", "modal");
  });

  it.each([
    ["xs", "fill"],
    ["m", "fill"],
    ["l", "end"],
    ["xl", "end"],
  ] as const)("a %s dialog lays its footer out as %s", (size, layout) => {
    render(<Dialog size={size} />);
    expect(screen.getByTestId("footer")).toHaveAttribute("data-layout", layout);
  });

  it("hangs from the top with placement top", () => {
    render(<Dialog placement="top" />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-placement", "top");
  });

  it("confirms on Enter in a field by default, not with confirmOnEnter false", () => {
    const onConfirm = vi.fn();
    const { unmount } = render(<Dialog onConfirm={onConfirm} />);
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Название" }), { key: "Enter" });
    expect(onConfirm).toHaveBeenCalledTimes(1);
    unmount();

    render(<Dialog confirmOnEnter={false} onConfirm={onConfirm} />);
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Название" }), { key: "Enter" });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
