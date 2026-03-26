import { CodeBlock } from "@/components/code-block/CodeBlock";

import { usePlaygroundTheme } from "../../components/PlaygroundTheme";

import styles from "./code-block-demos.module.css";

const LONG_LINE = `docker run --rm -e NODE_ENV=production -p 8080:8080 -v "$(pwd)/data:/app/data" registry.example.com/billing-api:latest --config /app/data/config.yml
`;

/** Узкая колонка и горизонтальная прокрутка: блок на всю ширину контейнера через обёртку и className. */
export default function CodeBlockFullWidthSnippet() {
  const { scheme } = usePlaygroundTheme();
  return (
    <div className={styles.fwNarrow}>
      <p className={styles.demoCaption}>Контейнер уже узкий — длинная строка уезжает в scroll.</p>
      <div className={styles.fwScrollWrap}>
        <CodeBlock.Root code={LONG_LINE} colorScheme={scheme} className="codeBlockFullBleed" />
      </div>
    </div>
  );
}
