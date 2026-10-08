import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders navigation with pagination label", () => {
    render(<Pagination value={1} totalPages={5} onValueChange={() => undefined} />);

    expect(screen.getByRole("navigation", { name: "Навигация по страницам" })).toBeInTheDocument();
  });

  it("defaults size to m via data-size on nav", () => {
    render(<Pagination value={1} totalPages={5} onValueChange={() => undefined} />);

    expect(screen.getByRole("navigation", { name: "Навигация по страницам" })).toHaveAttribute(
      "data-size",
      "m",
    );
  });

  it("sets data-size from size prop", () => {
    render(<Pagination value={1} totalPages={5} onValueChange={() => undefined} size="xl" />);

    expect(screen.getByRole("navigation", { name: "Навигация по страницам" })).toHaveAttribute(
      "data-size",
      "xl",
    );
  });

  it("calls onValueChange with previous page when Previous is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination value={2} totalPages={5} onValueChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Предыдущая страница" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onValueChange with next page when Next is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination value={2} totalPages={5} onValueChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Следующая страница" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onValueChange when a page number is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination value={1} totalPages={5} onValueChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Страница 3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("shows ellipsis for long page ranges", () => {
    render(<Pagination value={5} totalPages={20} onValueChange={() => undefined} />);

    const nav = screen.getByRole("navigation", { name: "Навигация по страницам" });
    const ellipses = within(nav).getAllByText("…");
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
    for (const el of ellipses) {
      expect(el).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("shows every page while they fit the slots the siblings need (2 × siblings + 5)", () => {
    const { rerender } = render(
      <Pagination value={5} totalPages={9} siblingCount={2} onValueChange={() => undefined} />,
    );
    const nav = screen.getByRole("navigation", { name: "Навигация по страницам" });
    expect(within(nav).queryByText("…")).toBeNull();
    expect(within(nav).getAllByRole("button", { name: /^Страница/ })).toHaveLength(9);
    // No siblings: five slots (first, gap, current, gap, last), so six pages already collapse.
    rerender(
      <Pagination value={3} totalPages={6} siblingCount={0} onValueChange={() => undefined} />,
    );
    expect(within(nav).getAllByText("…")).toHaveLength(2);
  });

  it("always shows first and last page for long ranges", () => {
    render(<Pagination value={10} totalPages={25} onValueChange={() => undefined} />);

    expect(screen.getByRole("button", { name: "Страница 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Страница 25" })).toBeInTheDocument();
  });

  it("disables Previous on page 1", () => {
    render(<Pagination value={1} totalPages={5} onValueChange={() => undefined} />);

    expect(screen.getByRole("button", { name: "Предыдущая страница" })).toBeDisabled();
  });

  it("disables Next on last page", () => {
    render(<Pagination value={5} totalPages={5} onValueChange={() => undefined} />);

    expect(screen.getByRole("button", { name: "Следующая страница" })).toBeDisabled();
  });

  it("sets aria-current=page on the active page button", () => {
    render(<Pagination value={3} totalPages={7} onValueChange={() => undefined} />);

    const current = screen.getByRole("button", { name: "Страница 3" });
    expect(current).toHaveAttribute("aria-current", "page");
    // The current page is accent (soft), the others neutral ghost.
    expect(current).toHaveAttribute("data-tone", "accent");
    expect(current).toHaveAttribute("data-variant", "soft");

    const other = screen.getByRole("button", { name: "Страница 2" });
    expect(other).not.toHaveAttribute("aria-current");
    expect(other).toHaveAttribute("data-tone", "neutral");
    expect(other).toHaveAttribute("data-variant", "ghost");
  });

  it("the Button's aria-current fill skips soft accent, so the current page stays accent", async () => {
    const fs = await import("node:fs");
    const css = fs.readFileSync("src/components/button/Button.module.css", "utf8");
    expect(css).toMatch(
      /\[aria-current="page"\][^{]*:not\(\s*\[data-tone="accent"\]\[data-variant="soft"\]\s*\)/,
    );
  });

  it("renders nothing when totalPages is below 1", () => {
    const { container } = render(
      <Pagination value={1} totalPages={0} onValueChange={() => undefined} />,
    );

    expect(container.firstChild).toBeNull();
  });
  it("renders current/total summary instead of page numbers in compact mode", () => {
    render(<Pagination value={3} totalPages={12} onValueChange={() => undefined} compact />);
    const nav = screen.getByRole("navigation", { name: "Навигация по страницам" });
    expect(nav).toHaveAttribute("data-compact", "true");
    expect(screen.queryByRole("button", { name: "Страница 3" })).not.toBeInTheDocument();
    expect(nav).toHaveTextContent("3/из12");
  });

  it("keeps page buttons and adds summary for compact auto", () => {
    render(<Pagination value={3} totalPages={12} onValueChange={() => undefined} compact="auto" />);
    expect(screen.getByRole("navigation", { name: "Навигация по страницам" })).toHaveAttribute(
      "data-compact",
      "auto",
    );
    expect(screen.getByRole("button", { name: "Страница 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("uncontrolled: defaultValue sets the start page and clicks move it", () => {
    const onValueChange = vi.fn();
    render(<Pagination defaultValue={2} totalPages={5} onValueChange={onValueChange} />);
    expect(screen.getByRole("button", { name: "Страница 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    fireEvent.click(screen.getByRole("button", { name: "Следующая страница" }));
    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("button", { name: "Страница 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("uses labels overrides", () => {
    render(<Pagination totalPages={3} labels={{ nav: "Pages", page: "Page {page}" }} />);
    expect(screen.getByRole("navigation", { name: "Pages" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
  });

  it("works from the keyboard: Tab reaches the buttons, Enter picks a page", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Pagination defaultValue={1} totalPages={5} onValueChange={onValueChange} />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Страница 1" })).toHaveFocus();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(2);
  });
});
