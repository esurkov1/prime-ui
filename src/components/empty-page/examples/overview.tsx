/** An empty search result: icon, title, description and two actions — `EmptyPage.Icon`, `EmptyPage.Actions`. */
import { Button, EmptyPage, Icon } from "prime-ui-kit";

export default function EmptyPageOverviewExample() {
  return (
    <EmptyPage.Root aria-labelledby="empty-search-title">
      <EmptyPage.Icon>
        <Icon name="action.search" />
      </EmptyPage.Icon>
      <EmptyPage.Title id="empty-search-title">Ничего не найдено</EmptyPage.Title>
      <EmptyPage.Description>
        По запросу «монитор 32″» нет товаров. Измените фильтры или сбросьте поиск.
      </EmptyPage.Description>
      <EmptyPage.Actions>
        <Button.Root variant="outline" tone="neutral">
          Сбросить фильтры
        </Button.Root>
        <Button.Root>Новый поиск</Button.Root>
      </EmptyPage.Actions>
    </EmptyPage.Root>
  );
}
