import { Textarea } from "@/components/textarea/Textarea";

export default function TextareaSizesSnippet() {
  return (
    <>
      <Textarea.Root size="s" placeholder="Размер s">
        <Textarea.Hint>size=&quot;s&quot;</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="m" placeholder="Размер m">
        <Textarea.Hint>size=&quot;m&quot;</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="l" placeholder="Размер l">
        <Textarea.Hint>size=&quot;l&quot;</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="xl" placeholder="Размер xl">
        <Textarea.Hint>size=&quot;xl&quot;</Textarea.Hint>
      </Textarea.Root>
    </>
  );
}
