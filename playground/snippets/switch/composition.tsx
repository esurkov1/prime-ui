import { Switch } from "@/components/switch/Switch";

export default function SwitchCompositionSnippet() {
  return (
    <>
      <Switch.Root
        size="m"
        defaultChecked
        aria-label="Включено: имя для скринридеров без видимого текста у трека"
      >
        <Switch.Label />
      </Switch.Root>
      <Switch.Root size="m">
        <Switch.Label>Разметка через Switch.Label и подсказка ниже</Switch.Label>
        <Switch.Hint>
          Hint выровнен под колонку текста; для ошибки используйте Switch.Error рядом с тем же Root.
        </Switch.Hint>
      </Switch.Root>
    </>
  );
}
