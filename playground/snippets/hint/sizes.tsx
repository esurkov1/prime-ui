import { Hint } from "@/components/hint/Hint";

/** Номинальный размер = у поля; кегль: xl→L, l→M, m→S поля, s→85% от S. */
export default function HintSizesSnippet() {
  return (
    <>
      <Hint.Root size="s">Подсказка размера s</Hint.Root>
      <Hint.Root size="m">Подсказка размера m</Hint.Root>
      <Hint.Root size="l">Подсказка размера l</Hint.Root>
      <Hint.Root size="xl">Подсказка размера xl</Hint.Root>
    </>
  );
}
