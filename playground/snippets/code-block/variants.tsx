import { CodeBlock } from "@/components/code-block/CodeBlock";
import { cx } from "@/internal/cx";

import styles from "./code-block-demos.module.css";

const SAMPLE = `import { streamTokens } from "./ai";

// ответ по частям
export async function handleChat(req: Request) {
  const body = await req.json();
  return new Response(streamTokens(body.prompt), {
    headers: { "Content-Type": "text/event-stream" },
  });
}
`;

/** Две схемы подсветки рядом: светлая и тёмная (проп colorScheme), один и тот же исходник. */
export default function CodeBlockVariantsSnippet() {
  return (
    <div className={styles.variantsGrid}>
      <div>
        <p className={styles.demoCaption}>colorScheme=&quot;light&quot;</p>
        <div className={styles.codeDemoPanel}>
          <CodeBlock.Root code={SAMPLE} colorScheme="light" />
        </div>
      </div>
      <div>
        <p className={styles.demoCaption}>colorScheme=&quot;dark&quot;</p>
        <div className={cx(styles.codeDemoPanel, styles.codeDemoPanelOnAccent)}>
          <CodeBlock.Root code={SAMPLE} colorScheme="dark" />
        </div>
      </div>
    </div>
  );
}
