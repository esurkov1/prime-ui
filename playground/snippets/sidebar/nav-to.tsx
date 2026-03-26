import { Building2, Truck } from "lucide-react";
import * as React from "react";
import { Sidebar, useSidebarNavTo } from "@/layout";

import styles from "./nav-to.module.css";

const contextItems = [
  { id: "crm", label: "CRM", icon: <Building2 size={16} strokeWidth={1.9} /> },
  { id: "fleet", label: "Fleet", icon: <Truck size={16} strokeWidth={1.9} /> },
];

function CrmPanelLinks() {
  const toDeals = useSidebarNavTo("deals");
  const toContacts = useSidebarNavTo("contacts");

  return (
    <Sidebar.NavPanelBody>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuRouterLink to={toDeals} end>
            <Sidebar.MenuLabel>Сделки</Sidebar.MenuLabel>
          </Sidebar.MenuRouterLink>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuRouterLink to={toContacts}>
            <Sidebar.MenuLabel>Контакты</Sidebar.MenuLabel>
          </Sidebar.MenuRouterLink>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.NavPanelBody>
  );
}

function FleetPanelLinks() {
  const toVehicles = useSidebarNavTo("vehicles");

  return (
    <Sidebar.NavPanelBody>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuRouterLink to={toVehicles}>
            <Sidebar.MenuLabel>Автопарк</Sidebar.MenuLabel>
          </Sidebar.MenuRouterLink>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.NavPanelBody>
  );
}

function Demo() {
  const [open, setOpen] = React.useState(true);

  return (
    <Sidebar.Root
      size="m"
      variant="double"
      defaultActiveSection="crm"
      open={open}
      onOpenChange={setOpen}
      responsive={false}
      aria-label="Маршруты с префиксом раздела"
    >
      <Sidebar.ContextBar items={contextItems} />
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.Text>Раздел + путь</Sidebar.Text>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.PanelSwitch
            sections={{
              crm: <CrmPanelLinks />,
              fleet: <FleetPanelLinks />,
            }}
          />
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}

export default function SidebarNavToSnippet() {
  return (
    <div className={styles.stage}>
      <Demo />
    </div>
  );
}
