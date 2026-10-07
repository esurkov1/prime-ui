/** A plain field whose fill comes from the surface context: white on the canvas, gray inside Card, Modal or Popover. Drop fields into any surface without overriding their background. */
import { Input } from "prime-ui-kit";

export default function InputSurfacesExample() {
  return (
    <Input.Root label="Город" hint="Заливка зависит от фона">
      <Input.Wrapper>
        <Input.Field placeholder="Москва" />
      </Input.Wrapper>
    </Input.Root>
  );
}
