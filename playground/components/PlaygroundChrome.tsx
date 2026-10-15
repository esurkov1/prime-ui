/**
 * The docs site's own chrome on every page: the path to the page and the site's buttons (search,
 * theme, preview surface) in the page's top bar. The layout knows where you are and owns the
 * search; each page renders the bar through `PlaygroundTopBar`.
 */
import * as React from "react";

import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";
import { Button } from "@/components/button/Button";
import { Kbd } from "@/components/kbd/Kbd";
import { Icon } from "@/icons";
import { Page } from "@/layout/page/Page";

import { PlaygroundHeaderControls } from "./PlaygroundHeaderControls";

type PlaygroundChrome = {
  /** The sidebar category of the page, if any. */
  category?: string;
  /** The page's name in the sidebar. */
  page: string;
  openSearch: () => void;
};

const ChromeContext = React.createContext<PlaygroundChrome | null>(null);

export const PlaygroundChromeProvider = ChromeContext.Provider;

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/** The top bar of a docs page: where you are, then search and the site controls. */
export function PlaygroundTopBar() {
  const chrome = React.useContext(ChromeContext);
  if (!chrome) return null;
  return (
    <Page.TopBar collapse>
      <Page.Heading>
        {/* Where you are, not a second title: the page heading is the h1 in the flow. */}
        <Breadcrumb.Root>
          {chrome.category ? <Breadcrumb.Item>{chrome.category}</Breadcrumb.Item> : null}
          <Breadcrumb.Item current>{chrome.page}</Breadcrumb.Item>
        </Breadcrumb.Root>
      </Page.Heading>
      <Page.Actions>
        {/* The docs site's own search over its pages — not a part of the kit. */}
        <Button.Root
          variant="soft"
          tone="neutral"
          aria-label="Поиск по компонентам"
          aria-haspopup="dialog"
          onClick={chrome.openSearch}
        >
          <Button.Icon>
            <Icon name="action.search" />
          </Button.Icon>
          Поиск
          <Kbd aria-hidden="true">{isMac ? "⌘K" : "Ctrl K"}</Kbd>
        </Button.Root>
        <PlaygroundHeaderControls />
      </Page.Actions>
    </Page.TopBar>
  );
}
