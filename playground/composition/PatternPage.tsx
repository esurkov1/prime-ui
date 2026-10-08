import type * as React from "react";

import { DocBlock, DocList, DocPage } from "../components/Doc";
import { renderInlineCode } from "../components/PlaygroundApiTable";
import { PlaygroundSourceFrame } from "../components/PlaygroundExampleFrame";
import styles from "./composition.module.css";
import { getPattern } from "./patternRegistry";
import type { CompositionPattern } from "./patterns";

/**
 * The content panel of an app (`AppShell.Main` on the surface, cards as sunken tiles) inside the
 * preview stage: a pattern renders only its page, exactly as it would in a consumer app.
 */
export function ScreenStage({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.screenFrame}>
      <div className={styles.screen}>{children}</div>
    </div>
  );
}

const screenStage = (preview: React.ReactNode) => <ScreenStage>{preview}</ScreenStage>;

/** One composition pattern: title → description → the screen (preview + code) → its rules. */
export function PatternPage({ pattern }: { pattern: CompositionPattern }) {
  return (
    <DocPage
      title={pattern.title}
      description={renderInlineCode(pattern.description)}
      measure="full"
    >
      <DocBlock
        title="Экран"
        description={renderInlineCode(
          `Файл \`SKILL/patterns/${pattern.file}.tsx\` — его же читает скилл. Код копируется в проект как есть: только компоненты кита и CSS-модуль раскладки на токенах.`,
        )}
      >
        <PlaygroundSourceFrame
          entry={getPattern(pattern.file)}
          previewLayout="full"
          stage={screenStage}
        />
      </DocBlock>
      <DocBlock title="Что здесь важно">
        <DocList>
          {pattern.rules.map((rule) => (
            <li key={rule}>{renderInlineCode(rule)}</li>
          ))}
        </DocList>
      </DocBlock>
    </DocPage>
  );
}
