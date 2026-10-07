/** A required leave period with a hint, the same field with an error and an optional return date — `required`, `hint`, `error`, `optional`. */
import { Datepicker } from "prime-ui-kit";

export default function DatepickerValidationExample() {
  return (
    <>
      <Datepicker.Root
        mode="range"
        label="Период отпуска"
        required
        hint="Не больше 28 дней подряд"
        placeholder="Выбрать период"
        fullWidth
      />
      <Datepicker.Root
        mode="range"
        label="Период отпуска"
        required
        error="Укажите начало и конец отпуска"
        placeholder="Выбрать период"
        fullWidth
      />
      <Datepicker.Root mode="single" label="Выход на работу" optional fullWidth />
    </>
  );
}
