import type * as React from "react";

import { DocBlock, DocList, DocPage } from "../components/Doc";
import { renderInlineCode } from "../components/PlaygroundApiTable";
import { PlaygroundSourceFrame } from "../components/PlaygroundExampleFrame";
import styles from "./composition.module.css";
import { getPattern } from "./patternRegistry";
import type { CompositionPattern } from "./patterns";

/**
 * The content panel of an app (the AppShell panel: the page itself, cards on it are layer 1) inside
 * the preview stage: a pattern renders only its page, exactly as it would in a consumer app.
 */
export function ScreenStage({ children, fill }: { children: React.ReactNode; fill?: boolean }) {
  return (
    <div className={styles.screenFrame}>
      <div className={styles.screen} data-fill={fill || undefined}>
        {children}
      </div>
    </div>
  );
}

const screenStage = (preview: React.ReactNode) => <ScreenStage>{preview}</ScreenStage>;
/** A page that fills the app panel's height: the stage stands in for a viewport-high panel. */
const fillStage = (preview: React.ReactNode) => <ScreenStage fill>{preview}</ScreenStage>;

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
          stage={pattern.fill ? fillStage : screenStage}
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
