import { Tag } from "@/components/tag/Tag";

/** Четыре размера — по одному на строку. */
export default function TagSizesSnippet() {
  return (
    <>
      <Tag.Root size="s">Tag s</Tag.Root>
      <Tag.Root size="m">Tag m</Tag.Root>
      <Tag.Root size="l">Tag l</Tag.Root>
      <Tag.Root size="xl">Tag xl</Tag.Root>
    </>
  );
}
