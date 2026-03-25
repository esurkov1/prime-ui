import { Checkbox } from "@/components/checkbox/Checkbox";

export default function CheckboxStatesSnippet() {
  return (
    <>
      <Checkbox.Root size="m">
        <Checkbox.Label>Не отмечен</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root size="m" defaultChecked>
        <Checkbox.Label>Отмечен (defaultChecked)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root size="m" indeterminate>
        <Checkbox.Label>Неопределённое состояние (indeterminate)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root size="m" required>
        <Checkbox.Label>Обязательный для формы (нативный required на input)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root size="m" disabled>
        <Checkbox.Label>Отключён</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root size="m" disabled defaultChecked>
        <Checkbox.Label>Отключён, отмечен</Checkbox.Label>
      </Checkbox.Root>
    </>
  );
}
