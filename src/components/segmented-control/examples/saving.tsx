/** A project setting saved on the server at once: the thumb stands on the new segment while the request runs, and a refused save glides it back and says why — `onValueChange`, `error`. */
import { SegmentedControl } from "prime-ui-kit";
import * as React from "react";

/** The server's answer a beat later: a project with an open contract stays visible to the client. */
function saveAccess(access: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (access === "team")
        reject(new Error("По проекту открыт договор: клиент должен его видеть"));
      else resolve();
    }, 900);
  });
}

export default function SegmentedControlSavingExample() {
  const [access, setAccess] = React.useState("client");
  const [error, setError] = React.useState<string>();

  return (
    <SegmentedControl.Root
      label="Кто видит проект"
      hint="Изменение сохраняется сразу"
      error={error}
      value={access}
      onValueChange={async (next) => {
        setError(undefined);
        try {
          await saveAccess(next);
        } catch (failure) {
          setError(failure instanceof Error ? failure.message : String(failure));
          throw failure;
        }
        setAccess(next);
      }}
    >
      <SegmentedControl.Item value="team">Команда</SegmentedControl.Item>
      <SegmentedControl.Item value="client">Команда и клиент</SegmentedControl.Item>
      <SegmentedControl.Item value="link">По ссылке</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
