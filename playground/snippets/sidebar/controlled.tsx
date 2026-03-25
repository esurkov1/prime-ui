import { FolderOpen, Layers, Sparkles } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/button/Button";
import { Sidebar } from "@/components/sidebar/Sidebar";

import styles from "./controlled.module.css";

export default function SidebarControlledSnippet() {
  const [open, setOpen] = React.useState(true);
  const [variant, setVariant] = React.useState<"simple" | "double">("double");
  const [activeSection, setActiveSection] = React.useState("crm");

  const contextItems = [
    { id: "crm", label: "CRM", icon: <FolderOpen size={16} strokeWidth={1.9} /> },
    { id: "labs", label: "Labs", icon: <Sparkles size={16} strokeWidth={1.9} /> },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Button.Root size="s" mode="stroke" type="button" onClick={() => setOpen((o) => !o)}>
          {open ? "Скрыть" : "Показать"}
        </Button.Root>
        <Button.Root
          size="s"
          mode="stroke"
          type="button"
          onClick={() => setVariant((v) => (v === "double" ? "simple" : "double"))}
        >
          Режим: {variant}
        </Button.Root>
        {variant === "double" ? (
          <Button.Root
            size="s"
            mode="stroke"
            type="button"
            onClick={() => setActiveSection((s) => (s === "crm" ? "labs" : "crm"))}
          >
            Раздел: {activeSection}
          </Button.Root>
        ) : null}
      </div>

      <div className={styles.stage}>
        <Sidebar.Root
          size="m"
          variant={variant}
          onVariantChange={setVariant}
          activeSection={variant === "double" ? activeSection : undefined}
          onActiveSectionChange={setActiveSection}
          open={open}
          onOpenChange={setOpen}
          responsive={false}
          aria-label="Контролируемый сайдбар"
        >
          {variant === "double" ? <Sidebar.ContextBar items={contextItems} /> : null}
          <Sidebar.NavPanel>
            <Sidebar.Header>
              <Sidebar.HeaderRow>
                <Sidebar.HeaderMain>
                  <Sidebar.Text>Панель</Sidebar.Text>
                </Sidebar.HeaderMain>
                <Sidebar.ToggleButton />
              </Sidebar.HeaderRow>
            </Sidebar.Header>
            <Sidebar.Content>
              {variant === "double" ? (
                <Sidebar.PanelSwitch
                  sections={{
                    crm: (
                      <Sidebar.NavPanelBody>
                        <Sidebar.Menu>
                          <Sidebar.MenuItem>
                            <Sidebar.MenuButton type="button" active>
                              <Sidebar.MenuIcon>
                                <Layers size={16} strokeWidth={1.9} />
                              </Sidebar.MenuIcon>
                              <Sidebar.MenuLabel>Воронка CRM</Sidebar.MenuLabel>
                            </Sidebar.MenuButton>
                          </Sidebar.MenuItem>
                        </Sidebar.Menu>
                      </Sidebar.NavPanelBody>
                    ),
                    labs: (
                      <Sidebar.NavPanelBody>
                        <Sidebar.Menu>
                          <Sidebar.MenuItem>
                            <Sidebar.MenuButton type="button" active>
                              <Sidebar.MenuIcon>
                                <Sparkles size={16} strokeWidth={1.9} />
                              </Sidebar.MenuIcon>
                              <Sidebar.MenuLabel>Эксперименты</Sidebar.MenuLabel>
                            </Sidebar.MenuButton>
                          </Sidebar.MenuItem>
                        </Sidebar.Menu>
                      </Sidebar.NavPanelBody>
                    ),
                  }}
                />
              ) : (
                <Sidebar.NavPanelBody>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton type="button" active>
                        <Sidebar.MenuLabel>Единственная колонка</Sidebar.MenuLabel>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.NavPanelBody>
              )}
            </Sidebar.Content>
          </Sidebar.NavPanel>
        </Sidebar.Root>
      </div>
    </div>
  );
}
