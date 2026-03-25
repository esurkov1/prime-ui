import { ButtonGroup } from "@/components/button-group/ButtonGroup";

export default function ButtonGroupStatesSnippet() {
  return (
    <div className="row">
      <ButtonGroup.Root aria-label="Состояния">
        <ButtonGroup.Item type="button">Default</ButtonGroup.Item>
        <ButtonGroup.Item pressed type="button">
          Pressed
        </ButtonGroup.Item>
        <ButtonGroup.Item disabled type="button">
          Disabled
        </ButtonGroup.Item>
      </ButtonGroup.Root>
    </div>
  );
}
