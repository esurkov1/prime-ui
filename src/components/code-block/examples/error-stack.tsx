import { CodeBlock } from "prime-ui-kit";

const STACK = `Error: connect ECONNREFUSED 127.0.0.1:5432
    at createConnectionError (node:net:1234:5)
    at afterConnect (node:net:567:8)
    at Query.run (/app/node_modules/pg/lib/query.js:42:10)
    at async fetchUserById (/app/src/users.ts:18:20)
`;

/** Стек ошибки или лог — многострочная строка; читабельность на тёмной подложке через colorScheme. */
export default function CodeBlockErrorStack() {
  return (
    <CodeBlock.Root
      code={STACK}
      colorScheme="dark"
      aria-label="Пример стека ошибки подключения к БД"
    />
  );
}
