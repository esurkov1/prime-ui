import { CodeBlock } from "@/components/code-block/CodeBlock";

import { usePlaygroundTheme } from "../../components/PlaygroundTheme";

import styles from "./code-block-demos.module.css";

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
    <div className={styles.sizesDemoStack}>
      {scales.map(({ label, fontSize, lineHeight }) => (
        <div key={label}>
          <p className={styles.demoCaption}>{label}</p>
          <div className={styles.codeDemoScaleBox} style={{ fontSize, lineHeight }}>
            <CodeBlock.Root code={SAMPLE} colorScheme={scheme} />
          </div>
        </div>
      ))}
    </div>
  );
}
