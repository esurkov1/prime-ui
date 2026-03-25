import { Radio } from "@/components/radio/Radio";

export default function RadioSizesSnippet() {
  return (
    <>
      <Radio.Root name="radio-size-s" value="on" defaultChecked size="s">
        <Radio.Label>Radio s</Radio.Label>
      </Radio.Root>
      <Radio.Root name="radio-size-m" value="on" defaultChecked size="m">
        <Radio.Label>Radio m</Radio.Label>
      </Radio.Root>
      <Radio.Root name="radio-size-l" value="on" defaultChecked size="l">
        <Radio.Label>Radio l</Radio.Label>
      </Radio.Root>
      <Radio.Root name="radio-size-xl" value="on" defaultChecked size="xl">
        <Radio.Label>Radio xl</Radio.Label>
      </Radio.Root>
    </>
  );
}
