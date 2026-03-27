import { ButtonGroup } from "prime-ui-kit";

/**
 * Full width: no dedicated prop — width on Root, equal segments via flex-1 on Items.
 */
export default function FullWidthExample() {
  return (
    <div className="w-full max-w-md">
      <ButtonGroup.Root aria-label="Plan tier" className="w-full" size="m">
        <ButtonGroup.Item className="min-w-0 flex-1" type="button">
          Basic
        </ButtonGroup.Item>
        <ButtonGroup.Item className="min-w-0 flex-1" pressed type="button">
          Pro
        </ButtonGroup.Item>
        <ButtonGroup.Item className="min-w-0 flex-1" type="button">
          Business
        </ButtonGroup.Item>
      </ButtonGroup.Root>
    </div>
  );
}
