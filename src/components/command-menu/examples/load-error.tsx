/** The results failed to load: the palette says so instead of the list, and a retry asks again with the button loading until the server answers; the first retry fails too, the second brings the results — `loadError`, `onRetry`. */
import { Button, CommandMenu } from "prime-ui-kit";
import * as React from "react";

type LoadState = "error" | "ready";

const INVOICES = ["СЧ-2024-0187", "СЧ-2024-0188", "СЧ-2024-0191", "СЧ-2024-0203"];
const LATENCY_MS = 800;

export default function CommandMenuLoadErrorExample() {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<LoadState>("error");
  const attempts = React.useRef(0);
  const close = () => setOpen(false);

  // The service answers a beat later: the first retry fails again, the next one brings the results.
  const retry = () =>
    new Promise<void>((resolve, reject) => {
      attempts.current += 1;
      const fails = attempts.current === 1;
      window.setTimeout(() => {
        if (fails) {
          reject(new Error("Сервис счетов не ответил"));
          return;
        }
        setState("ready");
        resolve();
      }, LATENCY_MS);
    });

  return (
    <>
      <Button.Root
        variant="soft"
        tone="neutral"
        onClick={() => {
          setState("error");
          attempts.current = 0;
          setOpen(true);
        }}
      >
        Найти счёт
      </Button.Root>
      <CommandMenu.Root
        open={open}
        onOpenChange={setOpen}
        loadError={state === "error" ? "Сервис счетов не ответил" : undefined}
        onRetry={retry}
        aria-label="Поиск счетов"
      >
        <CommandMenu.Input placeholder="Номер счёта" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          {state === "ready"
            ? INVOICES.map((invoice) => (
                <CommandMenu.Item key={invoice} value={invoice} onSelect={close}>
                  {invoice}
                </CommandMenu.Item>
              ))
            : null}
        </CommandMenu.List>
      </CommandMenu.Root>
    </>
  );
}
