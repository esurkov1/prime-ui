import { CodeBlock } from "@/components/code-block/CodeBlock";

import { usePlaygroundTheme } from "../../components/PlaygroundTheme";

import styles from "./code-block-demos.module.css";

const SAMPLE = `// хвостовые пробелы строки убираются перед подсветкой   
const ok = true;
`;

/** Атрибуты преформата через проп-спред: id, className, aria-label, data-*. Внутри вызывается highlightTsxHtml(code.trimEnd()). */
export default function CodeBlockFeaturesSnippet() {
  const { scheme } = usePlaygroundTheme();
  return (
    <div className={styles.featuresNarrow}>
      <CodeBlock.Root
        code={SAMPLE}
        colorScheme={scheme}
        id="playground-code-block-features"
        data-snippet-kind="tsx"
        aria-label="Пример: комментарий, ключевое слово и булев литерал"
        className={styles.featuresPre}
      />
    </div>
  );
}
