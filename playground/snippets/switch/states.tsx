import { Switch } from "@/components/switch/Switch";

export default function SwitchStatesSnippet() {
  return (
    <>
      <Switch.Root>
        <Switch.Label>Switch off</Switch.Label>
        <Switch.Hint>Switch hint</Switch.Hint>
      </Switch.Root>
      <Switch.Root defaultChecked>
        <Switch.Label>Switch on</Switch.Label>
        <Switch.Hint>Switch hint</Switch.Hint>
      </Switch.Root>
      <Switch.Root disabled>
        <Switch.Label>Switch disabled off</Switch.Label>
      </Switch.Root>
      <Switch.Root defaultChecked disabled>
        <Switch.Label>Switch disabled on</Switch.Label>
      </Switch.Root>
      <Switch.Root defaultChecked readOnly>
        <Switch.Label>Switch readonly on</Switch.Label>
      </Switch.Root>
      <Switch.Root variant="error">
        <Switch.Label>Switch error</Switch.Label>
        <Switch.Error>Switch error message</Switch.Error>
      </Switch.Root>
    </>
  );
}
