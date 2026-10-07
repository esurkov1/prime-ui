/** Full anatomy: header with icon, title and description, a body with a copyable link, a footer with two equal actions. Use as the default shape of a dialog. */
import { Check, Copy, ExternalLink, Send } from "lucide-react";
import { Button, Input, Modal, Typography } from "prime-ui-kit";
import * as React from "react";

const LINK = "https://t.me/w2rnotifybot?start=6d2725db4672";

export default function ModalLinkExample() {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LINK);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root>
          <Button.Icon>
            <Send />
          </Button.Icon>
          Привязать Telegram
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Icon>
            <Send />
          </Modal.Icon>
          <Modal.Title>Ссылка для привязки</Modal.Title>
          <Modal.Description>
            Откройте в Telegram и нажмите Start. Бот: @w2rnotifybot
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <Input.Root label="Ссылка" hint="Действует до 07.10.2026, 10:30:33">
            <Input.Wrapper>
              <Input.Field readOnly value={LINK} />
              <Button.Root
                variant="ghost"
                tone="neutral"
                size="xs"
                aria-label={copied ? "Скопировано" : "Скопировать ссылку"}
                onClick={copy}
              >
                <Button.Icon>{copied ? <Check /> : <Copy />}</Button.Icon>
              </Button.Root>
            </Input.Wrapper>
          </Input.Root>
          <Typography.Root variant="body-m" tone="secondary">
            После Start вернитесь в эту вкладку — список обновится сам. Настройки типов уведомлений
            — в карандаше или по клику на строку.
          </Typography.Root>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button.Root variant="outline" tone="neutral">
              Закрыть
            </Button.Root>
          </Modal.Close>
          <Modal.Confirm>
            <Button.Root onClick={() => window.open(LINK, "_blank", "noopener")}>
              <Button.Icon>
                <ExternalLink />
              </Button.Icon>
              Перейти
            </Button.Root>
          </Modal.Confirm>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
