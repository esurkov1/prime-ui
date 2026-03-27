import { Hint, Label } from "prime-ui-kit";

/** Stable `id` on `Hint.Root` and `aria-describedby` on the control so the hint is read with the field. */
export default function HintA11yDescribedbyExample() {
  return (
    <>
      <Label.Root htmlFor="hint-ex-a11y-volume" size="m">
        Notification volume
      </Label.Root>
      <input
        id="hint-ex-a11y-volume"
        type="range"
        min={0}
        max={100}
        defaultValue={40}
        aria-describedby="hint-ex-a11y-volume-help"
      />
      <Hint.Root id="hint-ex-a11y-volume-help" size="m" variant="default">
        Does not affect calls and alarms in the mobile app.
      </Hint.Root>
    </>
  );
}
