import { Info } from "lucide-react";
import { useState } from "react";

import { Banner } from "@/components/banner/Banner";
import { Typography } from "@/components/typography/Typography";

/**
 * 1) `onDismiss` без дочернего CloseButton — кнопка закрытия подставляется автоматически.
 * 2) Только `Banner.CloseButton` в разметке — закрытие через свой обработчик.
 * 3) И то и другое — вторая кнопка не дублируется: учитывается уже вставленный CloseButton.
 */
export default function BannerDismissPatternsSnippet() {
  const [autoDismissed, setAutoDismissed] = useState(false);
  const [manualDismissed, setManualDismissed] = useState(false);
  const [bothDismissed, setBothDismissed] = useState(false);

  return (
    <>
      {!autoDismissed ? (
        <Banner.Root status="information" variant="light" onDismiss={() => setAutoDismissed(true)}>
          <Banner.Content>
            <Banner.Icon as={Info} aria-hidden />
            <Banner.Title>Только onDismiss</Banner.Title>
            <Banner.Description>Справа появится стандартная кнопка «закрыть».</Banner.Description>
          </Banner.Content>
        </Banner.Root>
      ) : (
        <Typography.Root size="s" tone="muted">
          Автоматическая кнопка закрытия скрыла баннер.
        </Typography.Root>
      )}

      {!manualDismissed ? (
        <Banner.Root status="success" variant="lighter">
          <Banner.Content>
            <Banner.Icon as={Info} aria-hidden />
            <Banner.Title>Только Banner.CloseButton</Banner.Title>
            <Banner.Description>Явная кнопка в дереве, без onDismiss на корне.</Banner.Description>
          </Banner.Content>
          <Banner.CloseButton
            aria-label="Закрыть уведомление"
            onClick={() => setManualDismissed(true)}
          />
        </Banner.Root>
      ) : (
        <Typography.Root size="s" tone="muted">
          Закрыто вручную через Banner.CloseButton.
        </Typography.Root>
      )}

      {!bothDismissed ? (
        <Banner.Root status="warning" variant="stroke" onDismiss={() => setBothDismissed(true)}>
          <Banner.Content>
            <Banner.Icon as={Info} aria-hidden />
            <Banner.Title>onDismiss + CloseButton в разметке</Banner.Title>
            <Banner.Description>Дополнительная кнопка не добавляется повторно.</Banner.Description>
          </Banner.Content>
          <Banner.CloseButton
            aria-label="Закрыть предупреждение"
            onClick={() => setBothDismissed(true)}
          />
        </Banner.Root>
      ) : (
        <Typography.Root size="s" tone="muted">
          Закрыто по клику на единственную кнопку: автоматическая не подставлялась, так как
          CloseButton уже в дереве.
        </Typography.Root>
      )}
    </>
  );
}
