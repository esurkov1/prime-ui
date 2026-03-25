import { CodeBlock } from "@/components/code-block/CodeBlock";

import { usePlaygroundTheme } from "../../components/PlaygroundTheme";

const SAMPLE = `type Status = "idle" | "busy";
const retry = 3;
`;

const scales: { label: string; fontSize: string; lineHeight: string }[] = [
  {
    label: "Мелкий текст (как подпись)",
    fontSize: "var(--prime-sys-typography-support-2xs)",
    lineHeight: "var(--prime-sys-typography-lineHeight-tight)",
  },
  {
    label: "Обычный абзац",
    fontSize: "var(--prime-sys-typography-control-s)",
    lineHeight: "var(--prime-sys-typography-lineHeight-normal)",
  },
  {
    label: "Акцент в карточке",
    fontSize: "var(--prime-sys-typography-control-m)",
    lineHeight: "var(--prime-sys-typography-lineHeight-normal)",
  },
  {
    label: "Крупнее для превью",
    fontSize: "var(--prime-sys-typography-control-l)",
    lineHeight: "var(--prime-sys-typography-lineHeight-relaxed)",
  },
];

/** Кегль и межстрочный интервал задаются на обёртке: у CodeBlock нет пропа size, наследуется от родителя. */
export default function CodeBlockSizesSnippet() {
  const { scheme } = usePlaygroundTheme();
  return (
    <div className="sizesStack" style={{ alignItems: "stretch", maxWidth: "min(100%, 36rem)" }}>
      {scales.map(({ label, fontSize, lineHeight }) => (
        <div key={label}>
          <p style={{ margin: "0 0 var(--prime-sys-spacing-x1)", fontSize: 13, opacity: 0.85 }}>
            {label}
          </p>
          <div
            style={{
              fontSize,
              lineHeight,
              padding: "var(--prime-sys-spacing-x1) var(--prime-sys-spacing-x2)",
              borderRadius: "var(--prime-sys-radius-m)",
              border: "1px solid var(--prime-sys-color-border-muted)",
              background: "var(--prime-sys-color-surface-raised)",
            }}
          >
            <CodeBlock.Root code={SAMPLE} colorScheme={scheme} />
          </div>
        </div>
      ))}
    </div>
  );
}
