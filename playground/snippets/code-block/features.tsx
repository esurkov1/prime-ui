import { CodeBlock } from "@/components/code-block/CodeBlock";

import { usePlaygroundTheme } from "../../components/PlaygroundTheme";

const SAMPLE = `// хвостовые пробелы строки убираются перед подсветкой   
const ok = true;
`;

/** Атрибуты преформата через проп-спред: aria-label, data-*, style; внутри вызывается highlightTsxHtml(code.trimEnd()). */
export default function CodeBlockFeaturesSnippet() {
  const { scheme } = usePlaygroundTheme();
  return (
    <div style={{ maxWidth: "min(100%, 28rem)" }}>
      <CodeBlock.Root
        code={SAMPLE}
        colorScheme={scheme}
        id="playground-code-block-features"
        data-snippet-kind="tsx"
        aria-label="Пример: комментарий, ключевое слово и булев литерал"
        style={{
          padding: "var(--prime-sys-spacing-x2)",
          borderRadius: "var(--prime-sys-radius-m)",
          border: "1px dashed var(--prime-sys-color-border-strong)",
          background: "var(--prime-sys-color-surface-accentSoft)",
          fontSize: "var(--prime-sys-typography-control-s)",
          lineHeight: "var(--prime-sys-typography-lineHeight-normal)",
        }}
      />
    </div>
  );
}
