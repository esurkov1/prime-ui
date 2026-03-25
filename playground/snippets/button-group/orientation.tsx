import { ButtonGroup } from "@/components/button-group/ButtonGroup";

export default function ButtonGroupOrientationSnippet() {
  return (
    <div className="row rowAlignStart">
      <ButtonGroup.Root aria-label="Горизонтально">
        <ButtonGroup.Item type="button">One</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Two</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Three</ButtonGroup.Item>
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Вертикально" orientation="vertical">
        <ButtonGroup.Item type="button">Top</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Middle</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Bottom</ButtonGroup.Item>
      </ButtonGroup.Root>
    </div>
  );
}
