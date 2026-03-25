import { Hint } from "@/components/hint/Hint";

/** Три значения `variant` на размере `m` по умолчанию. */
export default function HintVariantsSnippet() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-start" }}
    >
      <Hint.Root size="m" variant="default">
        Нейтральная подсказка или формат ввода.
      </Hint.Root>
      <Hint.Root size="m" variant="error">
        Текст не совпадает с требованиями политики паролей.
      </Hint.Root>
      <Hint.Root size="m" variant="disabled">
        Редактирование недоступно для выбранной роли.
      </Hint.Root>
    </div>
  );
}
