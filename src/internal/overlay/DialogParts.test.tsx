import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
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
  it("starts the badges line under a record's picture, at the header's edge", () => {
    const rule = cssRule(
      "src/internal/overlay/DialogParts.module.css",
      '.header:has(> .icon[data-media="true"]) > .badges',
    );
    expect(cssValue(rule, "grid-column")).toBe("1 / -1");
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

  it("finds the picture through the consumer's own component and a wrapper: no tile, size l", () => {
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
    expect(avatar).toHaveAttribute("data-size", "l");
  });

  it("gives the tile back when the picture leaves the slot", () => {
    const { rerender } = render(<Dialog icon={<Avatar.Root data-testid="avatar" />} />);
    const box = screen.getByTestId("avatar").parentElement as HTMLElement;
    expect(box).toHaveAttribute("data-media", "true");
    rerender(<Dialog icon={<svg data-testid="glyph" />} />);
    expect(screen.getByTestId("glyph").parentElement).toHaveAttribute("data-tone", "accent");
    expect(screen.getByTestId("glyph").parentElement).not.toHaveAttribute("data-media");
  });

  it("lays a record header out in three lines: title with its number, the description, the badges row", () => {
    render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogHeader data-testid="header">
            <DialogDescription>Аренда байка Пхукет · заявка 19 сент, 06:37</DialogDescription>
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
    // The number is part of the name; the description is the text line alone.
    expect(dialog).toHaveAccessibleName("Александра #678");
    expect(dialog).toHaveAccessibleDescription("Аренда байка Пхукет · заявка 19 сент, 06:37");
    expect(screen.getByText("#678")).toHaveClass(styles.titleNumber);
    expect(screen.getByText("Александра")).toHaveClass(styles.titleName);
    // The badges row is the one-line Badge.Group of tier m, whatever order the parts come in.
    const badges = screen.getByTestId("badges");
    expect(badges).toHaveClass(styles.badges);
    expect(badges).toHaveAttribute("data-overflow", "count");
    expect(
      Array.from(badges.querySelectorAll(":scope > [data-tier]:not([data-overflowed])")).map(
        (badge) => badge.getAttribute("data-tier"),
      ),
    ).toEqual(["m", "m"]);
    expect(screen.getByTestId("header")).toHaveAttribute("data-multiline", "true");
    // Line order comes from the header, not the JSX: title, description, badges.
    expect(cssValue(cssRule(CSS, ".title"), "order")).toBe("0");
    expect(cssValue(cssRule(CSS, ".description"), "order")).toBe("1");
    expect(cssValue(cssRule(CSS, ".badges"), "order")).toBe("2");
    // The title and the description are a tight pair (4); the badges stand 8 under the line above.
    expect(cssValue(cssRule(CSS, ".description"), "margin")).toBe("var(--prime-space-1) 0 0");
    expect(cssValue(cssRule(CSS, ".badges"), "margin-block-start")).toBe("var(--prime-space-2)");
    expect(() => cssRule(CSS, ".header:has(> .badges) > .description")).toThrow();
  });

  it("cuts the name and the description of a record header to one line; the number never", () => {
    const record = ".header:is(:has(> .badges), :has(> .title > .titleNumber))";
    for (const line of [`${record} .titleName`, `${record} > .description`]) {
      const rule = cssRule(CSS, line);
      expect(cssValue(rule, "white-space")).toBe("nowrap");
      expect(cssValue(rule, "text-overflow")).toBe("ellipsis");
      expect(cssValue(rule, "overflow")).toBe("hidden");
    }
    expect(cssValue(cssRule(CSS, `${record} .titleNumber`), "flex")).toBe("none");
    // A question dialog keeps its wrapping title and description.
    expect(() => cssValue(cssRule(CSS, ".description"), "white-space")).toThrow();
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
    expect(screen.getByText("Аренда байка Пхукет")).toHaveAttribute("title", "Своя подсказка");
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
    expect(chip).toHaveAttribute("data-size", "m");
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

  it("makes the assignee chip a picker in the badges row, opened and chosen from the keyboard", async () => {
    const user = userEvent.setup();
    function Assignee() {
      const [name, setName] = React.useState<string | null>(null);
      return (
        <Dropdown.Root>
          <Dropdown.Trigger>
            {name ? (
              <Badge.Root aria-label={`Ответственный: ${name}`}>
                <Badge.Avatar>
                  <Avatar.Root color="purple">
                    <Avatar.Fallback>АК</Avatar.Fallback>
                  </Avatar.Root>
                </Badge.Avatar>
                {name}
              </Badge.Root>
            ) : (
              <Badge.Root variant="outline">Назначить</Badge.Root>
            )}
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onSelect={() => setName("Анна Котова")}>Анна Котова</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    }
    render(
      <Root defaultOpen>
        <DialogPanel kind="drawer" panelClassName="panel" swipe="never" footerLayout="end">
          <DialogHeader>
            <DialogTitle>Александра</DialogTitle>
            <DialogBadges>
              <Assignee />
            </DialogBadges>
          </DialogHeader>
        </DialogPanel>
      </Root>,
    );
    const assign = screen.getByRole("button", { name: "Назначить" });
    assign.focus();
    await user.keyboard("{Enter}");
    expect(assign).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowDown}{Enter}");
    const chip = await screen.findByRole("button", { name: "Ответственный: Анна Котова" });
    expect(chip).toHaveAttribute("aria-expanded", "false");
    // The avatar sits in the chip at the size of its tier (m → xs), decorative.
    const avatar = chip.querySelector("[data-color]");
    expect(avatar).toHaveAttribute("data-size", "xs");
    expect(avatar?.parentElement).toHaveAttribute("aria-hidden", "true");
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
