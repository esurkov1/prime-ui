import { Navigate, Route, Routes, useParams } from "react-router-dom";

import { NotificationProvider } from "@/components/notification/NotificationStore";
import { ComponentPage } from "./components/ComponentPage";
import { PlaygroundPreviewThemeProvider } from "./components/PlaygroundPreviewTheme";
import { PlaygroundThemeProvider } from "./components/PlaygroundTheme";
import { PlaygroundLayout } from "./PlaygroundLayout";
import { type PageDef, PLAYGROUND_INTRO, PLAYGROUND_PAGES } from "./playgroundPages";

function PageContent({ page }: { page: PageDef }) {
  if ("component" in page) return <ComponentPage page={page.component} />;
  const { Page } = page;
  return <Page />;
}

/** `/:segment` → the page with that segment; anything else goes home. */
function SegmentRoute() {
  const { segment } = useParams();
  const page = PLAYGROUND_PAGES.find((entry) => entry.segment === segment && segment !== "");
  return page ? <PageContent key={page.segment} page={page} /> : <Navigate to="/" replace />;
}

export function PlaygroundApp() {
  return (
    <PlaygroundThemeProvider>
      <PlaygroundPreviewThemeProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<PlaygroundLayout />}>
              <Route index element={<PageContent page={PLAYGROUND_INTRO} />} />
              <Route path=":segment" element={<SegmentRoute />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </PlaygroundPreviewThemeProvider>
    </PlaygroundThemeProvider>
  );
}
