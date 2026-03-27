import { Search } from "lucide-react";

import { Button } from "@/components/button/Button";
import { EmptyPage } from "@/components/empty-page/EmptyPage";

export default function EmptyPageCanonicalSnippet() {
  return (
    <EmptyPage.Root aria-labelledby="empty-heading">
      <EmptyPage.Icon aria-hidden>
        <Search strokeWidth={2} aria-hidden />
      </EmptyPage.Icon>
      <EmptyPage.Title id="empty-heading">Ничего не найдено</EmptyPage.Title>
      <EmptyPage.Description>
        Измените фильтры или сбросьте поиск — тогда мы снова покажем результаты.
      </EmptyPage.Description>
      <EmptyPage.Actions>
        <Button.Root type="button" variant="primary">
          Сбросить фильтры
        </Button.Root>
      </EmptyPage.Actions>
    </EmptyPage.Root>
  );
}
