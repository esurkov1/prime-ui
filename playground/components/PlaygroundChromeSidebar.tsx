import * as React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { Avatar } from "@/components/avatar/Avatar";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Icon } from "@/icons";
import { Sidebar } from "@/layout";

import {
  PLAYGROUND_INTRO,
  PLAYGROUND_NAV,
  type PlaygroundPageEntry,
  pageRoute,
} from "../playgroundPages";

function PageItem({ page }: { page: PlaygroundPageEntry }) {
  const Icon = page.icon;
  return (
    <Sidebar.Item asChild>
      <NavLink to={pageRoute(page.segment)} end={page.segment === ""}>
        <Sidebar.ItemIcon>
          <Icon />
        </Sidebar.ItemIcon>
        {page.label}
      </NavLink>
    </Sidebar.Item>
  );
}

function Brand() {
  return (
    <Sidebar.Brand asChild description="Graphite · playground">
      <Link to="/" aria-label="Prime UI — на главную">
        <Sidebar.BrandLogo>
          <span className="playgroundBrandMark">
            <span />
            <span />
            <span />
            <span />
          </span>
        </Sidebar.BrandLogo>
        Prime UI
      </Link>
    </Sidebar.Brand>
  );
}

/** A sample signed-in account at the bottom of the rail: how `Sidebar.Account` looks in an app. */
function Account() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Sidebar.Account description="anna@company.ru">
          <Avatar.Root color="purple">
            <Avatar.Fallback>АС</Avatar.Fallback>
          </Avatar.Root>
          Анна Смирнова
        </Sidebar.Account>
      </Dropdown.Trigger>
      <Dropdown.Content side="right" align="end">
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="object.user" />
          </Dropdown.ItemIcon>
          Профиль
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="action.settings" />
          </Dropdown.ItemIcon>
          Настройки аккаунта
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="action.logout" />
          </Dropdown.ItemIcon>
          Выйти
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

export type PlaygroundChromeSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Playground navigation built from the kit: brand header, collapsible categories, footer (search
 * lives in the AppHeader).
 * The rail mode and the folded categories are uncontrolled and remembered (`persistKey`), so a
 * toggle re-renders only what reads the sidebar context — never this tree or the page.
 */
export function PlaygroundChromeSidebar({ open, onOpenChange }: PlaygroundChromeSidebarProps) {
  const { pathname } = useLocation();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: keep the current page in view on route change
  React.useLayoutEffect(() => {
    contentRef.current
      ?.querySelector<HTMLElement>("[aria-current='page']")
      ?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <Sidebar.Root
      persistKey="prime-playground-sidebar"
      open={open}
      onOpenChange={onOpenChange}
      labels={{ navigation: "Навигация playground" }}
    >
      <Sidebar.Header>
        <Brand />
        <Sidebar.Toggle variant="header" />
      </Sidebar.Header>
      <Sidebar.Content ref={contentRef}>
        <Sidebar.Group>
          <PageItem page={PLAYGROUND_INTRO} />
        </Sidebar.Group>
        {PLAYGROUND_NAV.map((category) => (
          <Sidebar.Group key={category.id} label={category.label} collapsible>
            {category.pages.map((page) => (
              <PageItem key={page.segment} page={page} />
            ))}
          </Sidebar.Group>
        ))}
      </Sidebar.Content>
      <Sidebar.Footer>
        <Account />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}
