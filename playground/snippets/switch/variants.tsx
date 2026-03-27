import { Switch } from "@/components/switch/Switch";

export default function SwitchVariantsSnippet() {
  return (
    <>
      <Switch.Root defaultChecked>
        <Switch.Label>Обычный вид</Switch.Label>
        <Switch.Hint>variant по умолчанию — default</Switch.Hint>
      </Switch.Root>
      <Switch.Root defaultChecked variant="error">
        <Switch.Label>Ошибка валидации</Switch.Label>
        <Switch.Error>Отметьте согласие, чтобы продолжить</Switch.Error>
      </Switch.Root>
    </>
  );
}
