/** Record card fields that save on blur and Enter, revert on Escape and show the server's refusal — `onCommit`, `error`. */
import { Input } from "prime-ui-kit";
import * as React from "react";

const SAVE_DELAY_MS = 900;

/** Stands in for the API call: an empty value is refused like a server validation error. */
function saveField(value: string) {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => {
      if (value.trim() === "") reject(new Error("Поле не может быть пустым"));
      else resolve();
    }, SAVE_DELAY_MS);
  });
}

export default function InputInlineEditExample() {
  const [company, setCompany] = React.useState("ООО «Северный ветер»");
  const [manager, setManager] = React.useState("Анна Ковалёва");
  const [companyError, setCompanyError] = React.useState<string>();
  const [managerError, setManagerError] = React.useState<string>();

  const commitWith = (setError: (error: string | undefined) => void) => async (value: string) => {
    setError(undefined);
    try {
      await saveField(value);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось сохранить");
      throw reason;
    }
  };

  return (
    <>
      <Input.Root
        label="Компания"
        hint="Сохраняется при выходе из поля и по Enter, Escape отменяет правку"
        error={companyError}
        onCommit={commitWith(setCompanyError)}
      >
        <Input.Wrapper>
          <Input.Field value={company} onValueChange={setCompany} />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Ответственный" error={managerError} onCommit={commitWith(setManagerError)}>
        <Input.Wrapper>
          <Input.Field value={manager} onValueChange={setManager} />
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
