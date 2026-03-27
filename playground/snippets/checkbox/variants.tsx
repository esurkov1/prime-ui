import { Checkbox } from "@/components/checkbox/Checkbox";

export default function CheckboxVariantsSnippet() {
  return (
    <>
      <Checkbox.Root variant="default">
        <Checkbox.Label>Обычный вариант (variant=&quot;default&quot;)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root variant="error">
        <Checkbox.Label>
          Вариант ошибки (variant=&quot;error&quot;) — красная обводка
        </Checkbox.Label>
      </Checkbox.Root>
    </>
  );
}
