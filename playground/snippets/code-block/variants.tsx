import { CodeBlock } from "@/components/code-block/CodeBlock";

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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))",
        gap: "var(--prime-sys-spacing-m)",
        width: "100%",
        maxWidth: "min(100%, 48rem)",
      }}
    >
      <div>
        <p style={{ margin: "0 0 var(--prime-sys-spacing-x1)", fontSize: 13, opacity: 0.85 }}>
          colorScheme=&quot;light&quot;
        </p>
        <div
          style={{
            padding: "var(--prime-sys-spacing-x2)",
            borderRadius: "var(--prime-sys-radius-m)",
            border: "1px solid var(--prime-sys-color-border-muted)",
            background: "var(--prime-sys-color-surface-default)",
          }}
        >
          <CodeBlock.Root code={SAMPLE} colorScheme="light" />
        </div>
      </div>
      <div>
        <p style={{ margin: "0 0 var(--prime-sys-spacing-x1)", fontSize: 13, opacity: 0.85 }}>
          colorScheme=&quot;dark&quot;
        </p>
        <div
          style={{
            padding: "var(--prime-sys-spacing-x2)",
            borderRadius: "var(--prime-sys-radius-m)",
            border: "1px solid var(--prime-sys-color-border-muted)",
            background: "var(--prime-sys-color-surface-accentSoft)",
          }}
        >
          <CodeBlock.Root code={SAMPLE} colorScheme="dark" />
        </div>
      </div>
    </div>
  );
}
