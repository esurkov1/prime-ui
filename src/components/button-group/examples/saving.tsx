/** Feed filters saved to the profile on the server: a toggle shows its new state at once, and a refused save turns it back and says why — `defaultPressed`, `onPressedChange`, `error`. */
import { ButtonGroup } from "prime-ui-kit";
import * as React from "react";

type Kind = "comments" | "statuses" | "files";

const KINDS: { value: Kind; label: string; on: boolean }[] = [
  { value: "comments", label: "Комментарии", on: true },
  { value: "statuses", label: "Статусы", on: true },
  { value: "files", label: "Файлы", on: false },
];

/** The server's answer a beat later: the workspace policy keeps status changes in every feed. */
function saveFilter(kind: Kind, shown: boolean) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (kind === "statuses" && !shown) reject(new Error("Статусы в ленте включены для всех"));
      else resolve();
    }, 900);
  });
}

export default function ButtonGroupSavingExample() {
  const [error, setError] = React.useState<string>();

  return (
    <ButtonGroup.Root label="Показывать в ленте" error={error}>
      {KINDS.map((kind) => (
        <ButtonGroup.Item
          key={kind.value}
          defaultPressed={kind.on}
          onPressedChange={async (shown) => {
            setError(undefined);
            try {
              await saveFilter(kind.value, shown);
            } catch (failure) {
              setError(failure instanceof Error ? failure.message : String(failure));
              throw failure;
            }
          }}
        >
          {kind.label}
        </ButtonGroup.Item>
      ))}
    </ButtonGroup.Root>
  );
}
