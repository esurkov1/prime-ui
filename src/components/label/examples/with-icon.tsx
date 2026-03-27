import { Icon, Label } from "prime-ui-kit";

/** Icon slot: size follows `Label.Root`; hide decorative glyphs from assistive tech. */
export function WithIconExample() {
  return (
    <>
      <Label.Root htmlFor="example-label-icon-upload">
        <Label.Icon>
          <Icon surface="none" aria-hidden name="action.upload" />
        </Label.Icon>
        Attachment
      </Label.Root>
      <input id="example-label-icon-upload" type="file" name="attachment" />
    </>
  );
}
