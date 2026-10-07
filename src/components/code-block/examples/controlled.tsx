/** `code` comes from state: a ButtonGroup switches the shown snippet. Use for tabs of alternative snippets (utility / hook, npm / bun). */

import { ButtonGroup, CodeBlock } from "prime-ui-kit";
import { useState } from "react";

import styles from "./examples.module.css";

const SNIPPETS = {
  utility: `export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}`,
  hook: `import { useId } from "react";

export function useFieldIds(prefix: string) {
  const id = useId();
  return { input: \`\${prefix}-\${id}\`, hint: \`\${prefix}-\${id}-hint\` };
}`,
} as const;

type SnippetKey = keyof typeof SNIPPETS;

export default function CodeBlockControlledExample() {
  const [active, setActive] = useState<SnippetKey>("utility");

  return (
    <div className={styles.column}>
      <ButtonGroup.Root size="s" aria-label="Фрагмент">
        <ButtonGroup.Item pressed={active === "utility"} onClick={() => setActive("utility")}>
          Утилита
        </ButtonGroup.Item>
        <ButtonGroup.Item pressed={active === "hook"} onClick={() => setActive("hook")}>
          Хук
        </ButtonGroup.Item>
      </ButtonGroup.Root>
      <CodeBlock.Root code={SNIPPETS[active]} />
    </div>
  );
}
