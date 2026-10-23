import { readFileSync } from "node:fs";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Select } from "@/components/select/Select";
import { StatusDot } from "@/components/status-dot/StatusDot";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { headerRowStyles } from "@/internal/headerRow";
import { cssRule, cssValue } from "@/test/css";
import {
  DialogActions,
  DialogBadges,
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

const CSS = "src/internal/overlay/DialogParts.module.css";
const CSS_SOURCE = readFileSync(CSS, "utf8");

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
  it("stands as the surface frame `l` and draws no line between its zones", () => {
    render(<Dialog />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-frame", "l");
    expect(CSS_SOURCE).not.toContain("hairline");
    expect(screen.getByRole("banner")).not.toHaveClass("hairline");
  });

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

  it("sizes an avatar to the 48 mark of the header row (`xl`)", () => {
    render(
      <Dialog
        icon={
          <Avatar.Root size="s" data-testid="avatar">
            <Avatar.Fallback>АК</Avatar.Fallback>
          </Avatar.Root>
        }
      />,
    );
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "xl");
  });

  it("finds the picture through the consumer's own component and a wrapper: no tile, size xl", () => {
    function ClientAvatar() {
      return (
        <Avatar.Root size="s" data-testid="avatar">
          <Avatar.Fallback>ДВ</Avatar.Fallback>
        </Avatar.Root>
      );
    }
    render(
      <Dialog
        icon={
          <span>
            <ClientAvatar />
          </span>
        }
      />,
    );
    const avatar = screen.getByTestId("avatar");
    const box = avatar.closest(`.${styles.icon}`) as HTMLElement;
    expect(box).toHaveAttribute("data-media", "true");
    expect(box).not.toHaveAttribute("data-tone");
    expect(avatar).toHaveAttribute("data-size", "xl");
  });

  it("gives the tile back when the picture leaves the slot", () => {
    const { rerender } = render(<Dialog icon={<Avatar.Root data-testid="avatar" />} />);
    const box = screen.getByTestId("avatar").parentElement as HTMLElement;
    expect(box).toHaveAttribute("data-media", "true");
    rerender(<Dialog icon={<svg data-testid="glyph" />} />);
    expect(screen.getByTestId("glyph").parentElement).toHaveAttribute("data-tone", "accent");
    expect(screen.getByTestId("glyph").parentElement).not.toHaveAttribute("data-media");
  });

  it("lays a record header out as the header row: title with its number and badges on one line, the description under", () => {
    render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogHeader data-testid="header">
            <DialogDescription>
              <StatusDot tone="accent">Новая</StatusDot>
              Аренда байка Пхукет · заявка 19 сент, 06:37
            </DialogDescription>
            <DialogBadges data-testid="badges">
              <Badge.Root tone="info">Новая</Badge.Root>
              <Badge.Root color="sky">Telegram</Badge.Root>
            </DialogBadges>
            <DialogTitle number="#678">Александра</DialogTitle>
          </DialogHeader>
        </DialogPanel>
      </Root>,
    );
    const dialog = screen.getByRole("dialog");
    // The number is part of the name; the status dot is part of the description's text.
    expect(dialog).toHaveAccessibleName("Александра #678");
    expect(screen.getByText("#678")).toHaveClass(styles.titleNumber);
    expect(screen.getByText("Александра")).toHaveClass(styles.titleName);
    // The badges are the one-line Badge.Group of the frame's chip tier, after the title on its line.
    const badges = screen.getByTestId("badges");
    expect(badges).toHaveAttribute("data-overflow", "count");
    expect(
      Array.from(badges.querySelectorAll(":scope > [data-tier]:not([data-overflowed])")).map(
        (badge) => badge.getAttribute("data-tier"),
      ),
    ).toEqual(["s", "s"]);
    const title = screen.getByRole("heading", { level: 2 });
    expect(title.parentElement).toBe(badges.parentElement);
    expect(title.parentElement?.nextElementSibling).toBe(
      screen.getByText("Аренда байка Пхукет · заявка 19 сент, 06:37").closest("p"),
    );
    expect(title.parentElement?.parentElement?.parentElement).toHaveAttribute("data-lines", "two");
  });

  it("holds a record header on one line per line and lets a question dialog wrap", () => {
    // A header with a mark, badges or a numbered title is a record; a title with a text is a question.
    const { unmount } = render(
      <Root defaultOpen>
        <DialogPanel kind="modal" panelClassName="panel" swipe="never" footerLayout="fill">
          <DialogHeader>
            <DialogTitle>Удалить счёт?</DialogTitle>
            <DialogDescription>
              Счёт №1042 пропадёт без возможности восстановления.
            </DialogDescription>
          </DialogHeader>
        </DialogPanel>
      </Root>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass(styles.titleWrap);
    expect(
      screen.getByText("Счёт №1042 пропадёт без возможности восстановления.").closest("p"),
    ).toHaveClass(styles.descriptionWrap);
    unmount();
    render(<Dialog icon={<svg />} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass(headerRowStyles.title);
    expect(screen.getByText("Оплата до 20 октября").closest("p")).toHaveClass(
      headerRowStyles.description,
    );
    expect(cssValue(cssRule(CSS, ".titleNumber"), "flex")).toBe("none");
    expect(cssValue(cssRule(CSS, ".titleName"), "text-overflow")).toBe("ellipsis");
  });

  it("tells a cut line whole in its title while it is cut, unless the consumer set one", () => {
    const scroll = vi
      .spyOn(HTMLElement.prototype, "scrollWidth", "get")
      .mockImplementation(function (this: HTMLElement) {
        return this.tagName === "HEADER" ? 0 : 400;
      });
    const client = vi
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockImplementation(() => 200);
    render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogHeader>
            <DialogTitle number="#678">Александра Константинопольская</DialogTitle>
            <DialogDescription title="Своя подсказка">Аренда байка Пхукет</DialogDescription>
          </DialogHeader>
        </DialogPanel>
      </Root>,
    );
    expect(screen.getByText("Александра Константинопольская")).toHaveAttribute(
      "title",
      "Александра Константинопольская",
    );
    // The consumer's own `title` stays on the line; the cut text takes none.
    expect(screen.getByText("Аренда байка Пхукет").closest("p")).toHaveAttribute(
      "title",
      "Своя подсказка",
    );
    expect(screen.getByText("Аренда байка Пхукет")).not.toHaveAttribute("title");
    scroll.mockRestore();
    client.mockRestore();
  });

  it("holds the badges line with a skeleton while the record loads", () => {
    const { rerender } = render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogHeader>
            <DialogTitle>Александра</DialogTitle>
            <DialogBadges loading data-testid="badges">
              <Badge.Root tone="info">Новая</Badge.Root>
            </DialogBadges>
          </DialogHeader>
        </DialogPanel>
      </Root>,
    );
    expect(screen.getByTestId("badges")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("Новая")).toBeNull();
    // The placeholder is a badge of the line's tier, never a block with its own minimum height.
    const chip = screen.getByTestId("badges").querySelector("[data-shape]");
    expect(chip).toHaveAttribute("data-shape", "chip");
    expect(chip).toHaveAttribute("data-size", "s");
    rerender(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogHeader>
            <DialogTitle>Александра</DialogTitle>
            <DialogBadges data-testid="badges">
              <Badge.Root tone="info">Новая</Badge.Root>
            </DialogBadges>
          </DialogHeader>
        </DialogPanel>
      </Root>,
    );
    expect(screen.getByTestId("badges")).not.toHaveAttribute("aria-busy");
    expect(screen.getByText("Новая")).toBeInTheDocument();
  });

  it("holds a value picker in Actions at the dialog's control tier, as tall as the buttons", async () => {
    const user = userEvent.setup();
    render(
      <Root defaultOpen>
        <DialogPanel
          kind="drawer"
          panelClassName="panel"
          swipe="never"
          footerLayout="end"
          controlSize="m"
        >
          <DialogHeader>
            <DialogTitle>Александра</DialogTitle>
            <DialogActions data-testid="actions">
              <Select.Root aria-label="Ответственный" defaultValue="kotova">
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="kotova">Анна Котова</Select.Item>
                  <Select.Item value="orlov">Глеб Орлов</Select.Item>
                </Select.Content>
              </Select.Root>
            </DialogActions>
          </DialogHeader>
        </DialogPanel>
      </Root>,
    );
    const actions = screen.getByTestId("actions");
    expect(actions).toHaveAttribute("data-size", "m");
    const picker = screen.getByRole("combobox");
    expect(picker).toHaveAttribute("data-size", "m");
    expect(screen.getByRole("button", { name: "Закрыть" })).toHaveAttribute("data-size", "m");
    picker.focus();
    await user.keyboard("{Enter}");
    expect(picker).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(picker).toHaveTextContent("Глеб Орлов");
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

  it("keeps the close button beside the header row, never inside the end that wraps", () => {
    render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogHeader data-testid="header">
            <DialogTitle>Заказ №1042</DialogTitle>
            <DialogActions data-testid="actions">
              <Button.Root>Ещё</Button.Root>
            </DialogActions>
          </DialogHeader>
        </DialogPanel>
      </Root>,
    );
    const actions = screen.getByTestId("actions");
    const close = screen.getByRole("button", { name: "Закрыть" });
    const end = actions.parentElement;
    const row = end?.parentElement;
    expect(end).toHaveClass(headerRowStyles.end);
    expect(row).toHaveAttribute("data-lines", "one");
    expect(row).toHaveClass(headerRowStyles.header);
    expect(end?.contains(close)).toBe(false);
    expect(row?.contains(close)).toBe(false);
    expect(close.parentElement).toBe(row?.parentElement);
    expect(actions).toHaveAttribute("data-zone", "header");
  });

  it("keeps 32 between sections in plain flow, adds 16 to a smaller gap and nothing to a 32 gap", () => {
    render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogBody>
            <div>
              <DialogSection label="Контакты">Телефон</DialogSection>
              <DialogSection label="Сделки">Две открытые</DialogSection>
            </div>
            <div style={{ display: "flex", rowGap: "16px" }}>
              <DialogSection label="Оплата">Карта</DialogSection>
            </div>
            <div style={{ display: "flex", rowGap: "32px" }}>
              <DialogSection label="История">Три заказа</DialogSection>
            </div>
          </DialogBody>
        </DialogPanel>
      </Root>,
    );
    expect(screen.getByRole("region", { name: "Сделки" })).toHaveAttribute("data-flow", "block");
    expect(screen.getByRole("region", { name: "Оплата" })).toHaveAttribute("data-flow", "gap");
    expect(screen.getByRole("region", { name: "История" })).toHaveAttribute("data-flow", "step");
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
    // The line holds the height of the description's own text (body-s = the s tier).
    expect(busy?.querySelector("[data-shape]")).toHaveAttribute("data-size", "s");
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
