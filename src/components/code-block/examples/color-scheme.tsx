/** A block fixed to one scheme looks the same in both page themes — `colorScheme`. */
import { CodeBlock } from "prime-ui-kit";

const SAMPLE = `const retries = 3; // повторы при ошибке сети
export const isReady = (status: "idle" | "busy") => status === "idle";`;

export default function CodeBlockColorSchemeExample() {
  return (
    <>
      <CodeBlock code={SAMPLE} colorScheme="light" aria-label="Светлая схема" />
      <CodeBlock code={SAMPLE} colorScheme="dark" aria-label="Тёмная схема" />
    </>
  );
}
