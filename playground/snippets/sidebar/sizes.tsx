import { CircleDot, FolderOpen, Search } from "lucide-react";
import * as React from "react";
import type { AvatarSize } from "@/components/avatar/Avatar";
import { Avatar } from "@/components/avatar/Avatar";
import type { SidebarSize } from "@/layout";
import { Sidebar } from "@/layout";

import styles from "./sizes.module.css";

type DemoSize = SidebarSize;

const iconSizeBySidebar: Record<DemoSize, number> = {
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
};

const avatarSizeBySidebar: Record<DemoSize, AvatarSize> = {
  s: "s",
  m: "m",
  l: "l",
  xl: "xl",
};

function SidebarSizeColumn({ size }: { size: DemoSize }) {
  const [open, setOpen] = React.useState(true);
  const iconSize = iconSizeBySidebar[size];

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <p className={styles.badge}>{size}</p>
      </div>

      <div className={styles.stage}>
        <Sidebar.Root
          size={size}
          open={open}
          onOpenChange={setOpen}
          responsive={false}
          aria-label={`Sidebar ${size}`}
        >
          <Sidebar.NavPanel>
            <Sidebar.Header>
              <Sidebar.HeaderRow>
                <Sidebar.HeaderMain>
                  <Sidebar.IdentityButton
                    leading={
                      <span className={styles.brandMark} aria-hidden="true">
                        P
                      </span>
                    }
                    title="Prime-UI"
                    subtitle="Reakt UI-Kit"
                  />
                </Sidebar.HeaderMain>
                <Sidebar.ToggleButton />
              </Sidebar.HeaderRow>
            </Sidebar.Header>

            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupLabel>Раздел</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button" active>
                      <Sidebar.MenuIcon>
                        <FolderOpen size={iconSize} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Projects</Sidebar.MenuLabel>
                      <Sidebar.MenuTrailing>12</Sidebar.MenuTrailing>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button">
                      <Sidebar.MenuIcon>
                        <Search size={iconSize} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Search</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button">
                      <Sidebar.MenuIcon>
                        <CircleDot size={iconSize} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Activity</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>

            <Sidebar.Footer>
              <Sidebar.IdentityButton
                leading={
                  <Avatar.Root size={avatarSizeBySidebar[size]}>
                    <Avatar.Fallback>ES</Avatar.Fallback>
                  </Avatar.Root>
                }
                title="Egor Surkov"
                subtitle="Owner"
              />
            </Sidebar.Footer>
          </Sidebar.NavPanel>
        </Sidebar.Root>
      </div>
    </div>
  );
}

export default function SidebarSizesSnippet() {
  return (
    <div className={styles.root}>
      <SidebarSizeColumn size="s" />
      <SidebarSizeColumn size="m" />
      <SidebarSizeColumn size="l" />
      <SidebarSizeColumn size="xl" />
    </div>
  );
}
