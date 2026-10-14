import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Button } from "@/components/button/Button";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";

import {
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogPanel,
  type DialogRootOptions,
  DialogRootProvider,
  DialogTitle,
  DialogTrigger,
  useDialogGuard,
  useDialogRoot,
} from "./DialogParts";

type DialogKind = React.ComponentProps<typeof DialogPanel>["kind"];

function Root({ children, ...options }: DialogRootOptions & { children: React.ReactNode }) {
  return <DialogRootProvider value={useDialogRoot(options)}>{children}</DialogRootProvider>;
}

function Guard({ busy = false, dirty = false }: { busy?: boolean; dirty?: boolean }) {
  const { confirmingClose } = useDialogGuard({ busy, dirty });
  return confirmingClose ? <p>Спросить о потере изменений</p> : null;
}

function Dialog({
  kind = "modal",
  guard,
  footer,
  icon,
  onOpenChange,
}: {
  kind?: DialogKind;
  guard?: { busy?: boolean; dirty?: boolean };
  footer?: React.ComponentProps<typeof DialogFooter>["layout"];
  icon?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Root defaultOpen onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button.Root>Открыть</Button.Root>
      </DialogTrigger>
      <DialogPanel kind={kind} panelClassName="panel" swipe="never" footerLayout="fill">
        <DialogHeader>
          {icon === undefined ? null : <DialogIcon tone="accent">{icon}</DialogIcon>}
          <DialogTitle>Счёт №1042</DialogTitle>
          <DialogDescription>Оплата до 20 октября</DialogDescription>
        </DialogHeader>
        <DialogBody>{guard ? <Guard {...guard} /> : null}</DialogBody>
        <DialogFooter data-testid="footer" layout={footer}>
          <DialogClose>
            <Button.Root>Отмена</Button.Root>
          </DialogClose>
        </DialogFooter>
      </DialogPanel>
    </Root>
  );
}

describe("DialogParts", () => {
  it("names the dialog by its Title and describes it by its Description", () => {
    render(<Dialog />);
    const dialog = screen.getByRole("dialog", { name: "Счёт №1042" });
    expect(dialog).toHaveAccessibleDescription("Оплата до 20 октября");
  });

  it.each(["modal", "drawer", "sheet"] as const)("marks the %s kind on the panel", (kind) => {
    render(<Dialog kind={kind} />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-kind", kind);
  });

  it("lays the footer out from the panel, unless the footer sets its own layout", () => {
    const { unmount } = render(<Dialog />);
    expect(screen.getByTestId("footer")).toHaveAttribute("data-layout", "fill");
    unmount();
    render(<Dialog footer="end" />);
    expect(screen.getByTestId("footer")).toHaveAttribute("data-layout", "end");
  });

  it("closes from Close when nothing holds it", () => {
    const onOpenChange = vi.fn();
    render(<Dialog onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Отмена" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("holds a busy dialog: Close and the header close button are disabled", () => {
    const onOpenChange = vi.fn();
    render(<Dialog guard={{ busy: true }} onOpenChange={onOpenChange} />);
    expect(screen.getByRole("button", { name: "Отмена" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Закрыть" })).toBeDisabled();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("asks first when the dialog is dirty instead of closing", () => {
    const onOpenChange = vi.fn();
    render(<Dialog guard={{ dirty: true }} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText("Спросить о потере изменений")).toBeInTheDocument();
  });

  it("draws a glyph on a toned tile, and a picture without a tile", () => {
    const { unmount } = render(<Dialog icon={<svg data-testid="glyph" />} />);
    const tile = screen.getByTestId("glyph").parentElement as HTMLElement;
    expect(tile).toHaveAttribute("data-tone", "accent");
    expect(tile).not.toHaveAttribute("data-media");
    unmount();

    render(
      <Dialog
        icon={
          <Thumbnail.Root data-testid="picture">
            <Thumbnail.Image src="/invoice.png" alt="" />
          </Thumbnail.Root>
        }
      />,
    );
    const box = screen.getByTestId("picture").parentElement as HTMLElement;
    expect(box).toHaveAttribute("data-media", "true");
    expect(box).not.toHaveAttribute("data-tone");
  });

  it("sizes an avatar to the 40px icon box (`l`)", () => {
    render(
      <Dialog
        icon={
          <Avatar.Root size="s" data-testid="avatar">
            <Avatar.Fallback>АК</Avatar.Fallback>
          </Avatar.Root>
        }
      />,
    );
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "l");
  });
});
