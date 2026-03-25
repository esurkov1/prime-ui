import { Navigate, Route, Routes } from "react-router-dom";

import { NotificationProvider } from "@/components/notification/NotificationStore";
import { PlaygroundPreviewThemeProvider } from "./components/PlaygroundPreviewTheme";
import { PlaygroundThemeProvider } from "./components/PlaygroundTheme";
import { PlaygroundLayout } from "./PlaygroundLayout";
import { PLAYGROUND_PAGES } from "./playgroundPages";

export function PlaygroundApp() {
  const [intro, ...restPages] = PLAYGROUND_PAGES;
  if (intro.segment !== "") {
    throw new Error('[playground] PLAYGROUND_PAGES[0] must be the intro route (segment "")');
  }

  const IntroPage = intro.Page;

  return (
    <PlaygroundThemeProvider>
      <PlaygroundPreviewThemeProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<PlaygroundLayout />}>
              <Route index element={<IntroPage />} />
              {restPages.map(({ segment, Page }) => (
                <Route key={segment} path={segment} element={<Page />} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </PlaygroundPreviewThemeProvider>
    </PlaygroundThemeProvider>
  );
}
