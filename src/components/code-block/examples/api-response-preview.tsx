import { CodeBlock } from "prime-ui-kit";

const RESPONSE_BODY = `{
  "id": "ord_8f2a",
  "status": "paid",
  "total": 14990,
  "currency": "RUB",
  "items": [{ "sku": "sku-12", "qty": 2 }]
}
`;

/** Превью тела ответа API (JSON как текст; подсветка эвристическая, как для TS-подобного синтаксиса). */
export default function CodeBlockApiResponsePreview() {
  return (
    <CodeBlock.Root
      code={RESPONSE_BODY}
      colorScheme="light"
      aria-label="Пример JSON ответа GET /orders/:id"
    />
  );
}
