import { AppShell } from "prime-ui-kit";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";

export function PageLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Перейти к контенту
      </a>

      <AppShell.Template
        fillViewport
        nav={<Sidebar />}
        mainProps={{ id: "main-content", tabIndex: -1 }}
      >
        <Outlet />
      </AppShell.Template>
    </>
  );
}
