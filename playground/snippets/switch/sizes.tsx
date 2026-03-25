import { Switch } from "@/components/switch/Switch";

export default function SwitchSizesSnippet() {
  return (
    <>
      <Switch.Root size="s" defaultChecked>
        <Switch.Label>Switch s</Switch.Label>
      </Switch.Root>
      <Switch.Root size="m" defaultChecked>
        <Switch.Label>Switch m</Switch.Label>
      </Switch.Root>
      <Switch.Root size="l" defaultChecked>
        <Switch.Label>Switch l</Switch.Label>
      </Switch.Root>
      <Switch.Root size="xl" defaultChecked>
        <Switch.Label>Switch xl</Switch.Label>
      </Switch.Root>
    </>
  );
}
