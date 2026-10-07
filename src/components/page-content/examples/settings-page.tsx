/** A settings route inside AppShell.Main: header with title, description and actions, then panel cards in Body. Use for any app page with page-level actions. */
import { Button, Card, Input, PageContent, Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PageContentSettingsPageExample() {
  return (
    <div className={styles.main}>
      <PageContent.Section aria-labelledby="settings-heading">
        <PageContent.Header>
          <PageContent.Title id="settings-heading">Настройки</PageContent.Title>
          <PageContent.Description measure="full">
            Профиль рабочего пространства и уведомления.
          </PageContent.Description>
          <PageContent.Actions>
            <Button.Root variant="soft" tone="neutral">
              Экспорт
            </Button.Root>
            <Button.Root>Сохранить</Button.Root>
          </PageContent.Actions>
        </PageContent.Header>
        <PageContent.Body>
          <Card.Root variant="panel">
            <Card.SectionHeader>
              <Card.SectionTitle>Профиль</Card.SectionTitle>
            </Card.SectionHeader>
            <Card.Body>
              <Input.Root label="Название компании">
                <Input.Wrapper>
                  <Input.Field defaultValue="Прайм Софт" />
                </Input.Wrapper>
              </Input.Root>
            </Card.Body>
          </Card.Root>
          <Card.Root variant="panel">
            <Card.SectionHeader>
              <Card.SectionTitle>Уведомления</Card.SectionTitle>
            </Card.SectionHeader>
            <Card.Body>
              <Switch.Root defaultChecked>
                <Switch.Label>Письма о новых заказах</Switch.Label>
              </Switch.Root>
            </Card.Body>
          </Card.Root>
        </PageContent.Body>
      </PageContent.Section>
    </div>
  );
}
