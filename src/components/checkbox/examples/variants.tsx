/** The rounded square next to the circle, in three states — `shape`. */
import { Checkbox } from "prime-ui-kit";

const SHAPES = ["square", "circle"] as const;

export default function CheckboxVariantsExample() {
  return (
    <>
      {SHAPES.map((shape) => (
        <div key={shape}>
          <div>
            <Checkbox.Root shape={shape}>
              <Checkbox.Label>{shape}</Checkbox.Label>
            </Checkbox.Root>
          </div>
          <div>
            <Checkbox.Root shape={shape} defaultChecked>
              <Checkbox.Label>{shape} · checked</Checkbox.Label>
            </Checkbox.Root>
          </div>
          <div>
            <Checkbox.Root shape={shape} indeterminate>
              <Checkbox.Label>{shape} · indeterminate</Checkbox.Label>
            </Checkbox.Root>
          </div>
        </div>
      ))}
    </>
  );
}
