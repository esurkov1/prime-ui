import { Switch } from "@/components/switch/Switch";

export default function SwitchFullWidthSnippet() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "22rem",
        padding: "var(--prime-sys-spacing-x3)",
        border: "1px solid var(--prime-sys-color-border-subtle)",
        borderRadius: "var(--prime-sys-shape-radius-m)",
      }}
    >
      <Switch.Root size="m" defaultChecked>
        <Switch.Label>Растягивается на ширину карточки</Switch.Label>
        <Switch.Hint>Корень поля занимает 100% ширины контейнера</Switch.Hint>
      </Switch.Root>
    </div>
  );
}
