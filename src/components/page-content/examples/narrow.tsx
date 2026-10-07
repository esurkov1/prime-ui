/** In a phone-width column the page actions wrap under the heading instead of squeezing it. */
import { Button, PageContent } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PageContentNarrowExample() {
  return (
    <div className={styles.narrow}>
      <div className={styles.main}>
        <PageContent.Root>
          <PageContent.Header>
            <PageContent.Title>Счета</PageContent.Title>
            <PageContent.Description>Выставленные и оплаченные за квартал.</PageContent.Description>
            <PageContent.Actions>
              <Button.Root variant="soft" tone="neutral">
                Экспорт
              </Button.Root>
              <Button.Root>Новый счёт</Button.Root>
            </PageContent.Actions>
          </PageContent.Header>
        </PageContent.Root>
      </div>
    </div>
  );
}
