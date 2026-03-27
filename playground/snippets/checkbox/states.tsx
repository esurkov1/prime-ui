import { Checkbox } from "@/components/checkbox/Checkbox";

export default function CheckboxStatesSnippet() {
  return (
    <>
      <Checkbox.Root>
        <Checkbox.Label>Не отмечен</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root defaultChecked>
        <Checkbox.Label>Отмечен (defaultChecked)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root indeterminate>
        <Checkbox.Label>Неопределённое состояние (indeterminate)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root required>
        <Checkbox.Label>Обязательный для формы (нативный required на input)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root disabled>
        <Checkbox.Label>Отключён</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root disabled defaultChecked>
        <Checkbox.Label>Отключён, отмечен</Checkbox.Label>
      </Checkbox.Root>
    </>
  );
}
