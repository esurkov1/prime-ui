/** An empty search result with the basic parts: Icon, Title (`h2`), Description and Actions. Use it when filters or a query return nothing. */
import { Search } from "lucide-react";
import { Button, EmptyPage } from "prime-ui-kit";

export default function EmptyPageNoResultsExample() {
  return (
    <EmptyPage.Root aria-labelledby="empty-search-title">
      <EmptyPage.Icon>
        <Search aria-hidden />
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
