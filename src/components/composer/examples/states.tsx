/** A closed conversation is disabled, a slow send keeps the text with a busy button until the server answers — `disabled`, `onSend`. */
import { Composer, Typography } from "prime-ui-kit";

const SLOW_SEND_MS = 2500;

const slowSend = () => new Promise<void>((resolve) => window.setTimeout(resolve, SLOW_SEND_MS));

export default function ComposerStatesExample() {
  return (
    <div>
      <div>
        <Composer.Root disabled defaultValue="Обращение закрыто">
          <Composer.Attach />
        </Composer.Root>
        <Typography as="span" variant="caption" tone="muted">
          disabled
        </Typography>
      </div>
      <div>
        <Composer.Root defaultValue="Нажмите Enter — отправка займёт пару секунд" onSend={slowSend}>
          <Composer.Attach />
        </Composer.Root>
        <Typography as="span" variant="caption" tone="muted">
          onSend → Promise
        </Typography>
      </div>
    </div>
  );
}
