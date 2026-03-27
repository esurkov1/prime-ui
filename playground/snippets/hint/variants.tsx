import { Hint } from "@/components/hint/Hint";

/** Три значения `variant` на размере `m` по умолчанию. */
export default function HintVariantsSnippet() {
  return (
    <div className="stack">
      <Hint.Root variant="default">Нейтральная подсказка или формат ввода.</Hint.Root>
      <Hint.Root variant="error">Текст не совпадает с требованиями политики паролей.</Hint.Root>
      <Hint.Root variant="disabled">Редактирование недоступно для выбранной роли.</Hint.Root>
    </div>
  );
}
