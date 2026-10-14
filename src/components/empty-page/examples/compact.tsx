/** The quiet empty state of a search popover: no entrance motion, smaller text, a paragraph title, one action — `layout`, `as`. */
import { Button, EmptyPage, Icon, Popover } from "prime-ui-kit";

export default function EmptyPageCompactExample() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button.Root variant="soft" tone="neutral">
          <Button.Icon>
            <Icon name="action.search" />
          </Button.Icon>
          Клиенты по запросу «Северный»
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content size="s" aria-label="Клиенты по запросу «Северный»">
        <EmptyPage.Root layout="compact" role="status">
          <EmptyPage.Icon>
            <Icon name="action.search" />
          </EmptyPage.Icon>
          <EmptyPage.Title as="p">Ничего не найдено</EmptyPage.Title>
          <EmptyPage.Description>Нет клиентов с названием «Северный»</EmptyPage.Description>
          <EmptyPage.Actions>
            <Popover.Close>
              <Button.Root variant="soft" tone="neutral">
                Сбросить поиск
              </Button.Root>
            </Popover.Close>
          </EmptyPage.Actions>
        </EmptyPage.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
