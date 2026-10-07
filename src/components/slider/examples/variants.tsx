/** Every fill color; accent by default, semantic tones when the value carries meaning — `tone`. */
import { Slider } from "prime-ui-kit";

const TONE_ROWS = [
  ["accent", "neutral", "success"],
  ["warning", "danger", "info"],
] as const;

export default function SliderVariantsExample() {
  return (
    <>
      {TONE_ROWS.map((row) => (
        <div key={row[0]}>
          {row.map((tone) => (
            <div key={tone}>
              <Slider tone={tone} label={tone} showValue defaultValue={60} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
