import { Textarea } from "prime-ui-kit";

/** Four `size` tiers — one field per size with a matching `Textarea.Hint` label. */
export default function TextareaSizesExample() {
  return (
    <>
      <Textarea.Root size="s" placeholder="Size s">
        <Textarea.Hint>size=&quot;s&quot;</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="m" placeholder="Size m">
        <Textarea.Hint>size=&quot;m&quot;</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="l" placeholder="Size l">
        <Textarea.Hint>size=&quot;l&quot;</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="xl" placeholder="Size xl">
        <Textarea.Hint>size=&quot;xl&quot;</Textarea.Hint>
      </Textarea.Root>
    </>
  );
}
