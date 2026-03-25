import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";

/** Связь текста подсказки с полем через `id` на `Hint.Root` и `aria-describedby` на вводе. */
export default function HintA11yDescribedbySnippet() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-xs)",
        alignItems: "flex-start",
        maxWidth: "22rem",
      }}
    >
      <Label.Root htmlFor="hint-a11y-volume" size="m">
        Громкость уведомлений
      </Label.Root>
      <input
        id="hint-a11y-volume"
        type="range"
        min={0}
        max={100}
        defaultValue={40}
        aria-describedby="hint-a11y-volume-help"
      />
      <Hint.Root id="hint-a11y-volume-help" size="m" variant="default">
        Не влияет на звонки и будильник в мобильном приложении.
      </Hint.Root>
    </div>
  );
}
