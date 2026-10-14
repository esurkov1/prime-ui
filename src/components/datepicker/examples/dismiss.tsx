/** A shift period with a footer: the calendar keeps the draft on a press beside it and closes by Escape, Reset or Apply — `closeOnOutsideClick`, `closeOnEscape`. */
import { Datepicker } from "prime-ui-kit";

export default function DatepickerDismissExample() {
  return (
    <Datepicker.Root
      mode="range"
      label="Смена склада"
      footer
      withTime
      closeOnOutsideClick={false}
      closeOnEscape
    />
  );
}
