import * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";

import { renderInlineCode } from "../components/PlaygroundApiTable";
import { DemoDescription, DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import { RuleList } from "../foundation/FoundationKit";
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

/** One composition pattern: title → description → the screen (preview + code) → its rules. */
export function PatternPage({ pattern }: { pattern: CompositionPattern }) {
  const { Component, source } = getPattern(pattern.file);
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>{pattern.title}</PageContent.Title>
        <PageContent.Description measure="full">
          {renderInlineCode(pattern.description)}
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Экран</DemoSectionTitle>
            <DemoDescription>
              {renderInlineCode(
                `Файл \`SKILL/patterns/${pattern.file}.tsx\` — его же читает скилл. Код копируется в проект как есть: только компоненты кита и CSS-модуль раскладки на токенах.`,
              )}
            </DemoDescription>
            <PlaygroundExampleFrame code={source} previewLayout="full">
              <ScreenStage>
                <React.Suspense fallback={null}>
                  <Component />
                </React.Suspense>
              </ScreenStage>
            </PlaygroundExampleFrame>
          </div>
          <div className="demoBlock">
            <DemoSectionTitle>Что здесь важно</DemoSectionTitle>
            <RuleList>
              {pattern.rules.map((rule) => (
                <li key={rule}>{renderInlineCode(rule)}</li>
              ))}
            </RuleList>
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
