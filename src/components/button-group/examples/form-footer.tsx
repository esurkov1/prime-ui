import { ButtonGroup } from "prime-ui-kit";

/**
 * Form footer: native submit + reset in one segmented control.
 */
export default function FormFooterExample() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <ButtonGroup.Root aria-label="Save or reset draft" size="m">
        <ButtonGroup.Item type="submit">Save</ButtonGroup.Item>
        <ButtonGroup.Item type="reset">Reset</ButtonGroup.Item>
      </ButtonGroup.Root>
    </form>
  );
}
