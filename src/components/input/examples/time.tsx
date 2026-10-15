/** A call slot as a time of day: the browser's hour and minute segments, arrows step them, working hours only — `type`, `step`, `min`, `max`. */
import { Input } from "prime-ui-kit";
import * as React from "react";

const QUARTER_HOUR = 15 * 60;

export default function InputTimeExample() {
  const [time, setTime] = React.useState("10:30");

  return (
    <Input.Root label="Время звонка" hint="С 09:00 до 18:00, шаг 15 минут">
      <Input.Wrapper>
        <Input.Field
          type="time"
          value={time}
          onValueChange={setTime}
          step={QUARTER_HOUR}
          min="09:00"
          max="18:00"
        />
      </Input.Wrapper>
    </Input.Root>
  );
}
