/** A provider at the app root and a success toast from any screen — `NotificationProvider`, `notify`. */
import { Button, NotificationProvider, useNotifications } from "prime-ui-kit";

function CopyLinkButton() {
  const { notify } = useNotifications();
  return (
    <Button.Root
      variant="outline"
      tone="neutral"
      onClick={() => notify({ tone: "success", title: "Ссылка на счёт скопирована" })}
    >
      Скопировать ссылку
    </Button.Root>
  );
}

export default function NotificationOverviewExample() {
  // In an app NotificationProvider wraps the root once; here it keeps the example self-contained.
  return (
    <NotificationProvider>
      <CopyLinkButton />
    </NotificationProvider>
  );
}
