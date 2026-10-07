/** A text page in `PageContent.Root maxWidth="readable"`, held to ~65 characters per line. Use for terms, articles and help pages. */
import { PageContent, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PageContentReadableExample() {
  return (
    <div className={styles.main}>
      <PageContent.Root maxWidth="readable">
        <PageContent.Header>
          <PageContent.Title>Условия использования</PageContent.Title>
          <PageContent.Description>Обновлено 1 октября 2026 года.</PageContent.Description>
        </PageContent.Header>
        <PageContent.Body>
          <Typography.Root as="p" variant="body-l">
            Сервис помогает командам вести продажи и отчётность. Используя его, вы соглашаетесь
            хранить доступы в тайне и не передавать их третьим лицам. Мы бережно обращаемся с
            данными и удаляем их по первому запросу.
          </Typography.Root>
        </PageContent.Body>
      </PageContent.Root>
    </div>
  );
}
