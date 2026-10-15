import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Button } from "@/components/button/Button";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import {
  DialogActions,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogMeta,
  DialogPanel,
  type DialogRootOptions,
  DialogRootProvider,
  DialogSection,
  DialogTitle,
  DialogTrigger,
  useDialogGuard,
  useDialogRoot,
} from "./DialogParts";
import styles from "./DialogParts.module.css";

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

  it("names a body section by its h3 heading and puts its Actions at the end of the heading row", () => {
    render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogHeader>
            <DialogTitle>Анна Соколова</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogSection label="Открытые сделки" description="2 сделки на 1 620 000 ₽">
              <DialogActions>
                <Button.Root>Сделка</Button.Root>
              </DialogActions>
              <p>Поставка серверов</p>
            </DialogSection>
          </DialogBody>
        </DialogPanel>
      </Root>,
    );
    const section = screen.getByRole("region", { name: "Открытые сделки" });
    expect(screen.getByRole("heading", { level: 3, name: "Открытые сделки" })).toBeInTheDocument();
    expect(screen.getByText("2 сделки на 1 620 000 ₽").tagName).toBe("P");
    const action = screen.getByRole("button", { name: "Сделка" });
    expect(action.closest(`.${styles.sectionHeader}`)).not.toBeNull();
    expect(action.closest(`.${styles.actions}`)).toHaveAttribute("data-size", "s");
    expect(screen.getByText("Поставка серверов").parentElement).toBe(section);
  });

  it("moves the header Actions under the title when the row has no room for the title beside them", () => {
    // The header overflows (the title's 12rem minimum beside the actions) until the actions go below.
    const scrollWidth = vi
      .spyOn(HTMLElement.prototype, "scrollWidth", "get")
      .mockImplementation(function (this: HTMLElement) {
        return this.tagName === "HEADER" && !this.hasAttribute("data-actions-below") ? 420 : 343;
      });
    const clientWidth = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(343);
    const { rerender } = render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogHeader data-testid="header">
            <DialogTitle>Заказ №1042</DialogTitle>
            <DialogActions>
              <Button.Root>Ещё</Button.Root>
            </DialogActions>
          </DialogHeader>
        </DialogPanel>
      </Root>,
    );
    expect(screen.getByTestId("header")).toHaveAttribute("data-actions-below");

    // A wide row keeps them beside the title.
    clientWidth.mockReturnValue(640);
    scrollWidth.mockReturnValue(640);
    rerender(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogHeader data-testid="header">
            <DialogTitle>Заказ №1042</DialogTitle>
            <DialogActions>
              <Button.Root>Ещё</Button.Root>
            </DialogActions>
          </DialogHeader>
        </DialogPanel>
      </Root>,
    );
    expect(screen.getByTestId("header")).not.toHaveAttribute("data-actions-below");
    scrollWidth.mockRestore();
    clientWidth.mockRestore();
  });

  it("keeps 32 between sections in plain flow (a tab panel), 16 more than a gapped column gives", () => {
    render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogBody>
            <div role="tabpanel" aria-label="Профиль">
              <DialogSection label="Контакты">Телефон</DialogSection>
              <DialogSection label="Сделки">Две открытые</DialogSection>
            </div>
            <div data-testid="column" style={{ display: "flex", rowGap: "16px" }}>
              <DialogSection label="Оплата">Карта</DialogSection>
            </div>
          </DialogBody>
        </DialogPanel>
      </Root>,
    );
    expect(screen.getByRole("region", { name: "Сделки" })).toHaveAttribute("data-flow", "block");
    expect(screen.getByRole("region", { name: "Оплата" })).toHaveAttribute("data-flow", "gap");
  });

  it("holds the description's place with a Skeleton while it loads, then shows the data", () => {
    function Header({ loading }: { loading: boolean }) {
      return (
        <Root defaultOpen>
          <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
            <DialogHeader>
              <DialogTitle>Велосипед</DialogTitle>
              <DialogDescription loading={loading}>Тур 2, на линии</DialogDescription>
            </DialogHeader>
          </DialogPanel>
        </Root>
      );
    }
    const { rerender } = render(<Header loading />);
    const dialog = screen.getByRole("dialog");
    const busy = dialog.querySelector("[aria-busy='true']");
    expect(busy?.tagName).toBe("P");
    expect(screen.queryByText("Тур 2, на линии")).toBeNull();
    rerender(<Header loading={false} />);
    expect(dialog).toHaveAccessibleDescription("Тур 2, на линии");
    expect(dialog.querySelector("[aria-busy]")).toBeNull();
  });

  it("keeps the footer buttons one row beside a Meta, so the status wraps above them first", () => {
    render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogFooter data-testid="footer">
            <DialogMeta>Есть несохранённые изменения</DialogMeta>
            <Button.Root>Отмена</Button.Root>
            <Button.Root>Черновик</Button.Root>
            <Button.Root>Сохранить</Button.Root>
          </DialogFooter>
        </DialogPanel>
      </Root>,
    );
    const footer = screen.getByTestId("footer");
    const [meta, row] = Array.from(footer.children);
    expect(meta).toHaveTextContent("Есть несохранённые изменения");
    expect(row).toHaveClass(styles.footerActions);
    expect(Array.from(row.children).map((button) => button.textContent)).toEqual([
      "Отмена",
      "Черновик",
      "Сохранить",
    ]);
  });
});
