/** A client's card edited on its own page: after an edit a press on the navigation or the path asks before the changes are lost, and while it saves nothing leaves — `Page.Guard`, `dirty`, `busy`. */
import { AppShell, Breadcrumb, Button, Card, Icon, Input, Page, Sidebar } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SAVED_NAME = "ООО «Северный ветер»";
const SAVED_MANAGER = "Анна Морозова";

export default function PageGuardExample() {
  const [name, setName] = React.useState(SAVED_NAME);
  const [manager, setManager] = React.useState(SAVED_MANAGER);
  const [saved, setSaved] = React.useState({ name: SAVED_NAME, manager: SAVED_MANAGER });
  const [saving, setSaving] = React.useState(false);
  const formId = React.useId();
  const dirty = name !== saved.name || manager !== saved.manager;

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      setSaved({ name, manager });
      setSaving(false);
    }, 1200);
  };

  return (
    <div className={styles.window}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Nav>
          <Sidebar.Root>
            <Sidebar.Content>
              <Sidebar.Item href="#orders">
                <Sidebar.ItemIcon>
                  <Icon name="object.package" />
                </Sidebar.ItemIcon>
                Заказы
              </Sidebar.Item>
              <Sidebar.Item href="#clients" current>
                <Sidebar.ItemIcon>
                  <Icon name="object.users" />
                </Sidebar.ItemIcon>
                Клиенты
              </Sidebar.Item>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Main>
          <Page.Root>
            <Page.Guard dirty={dirty} busy={saving} />
            <Page.TopBar>
              <Page.Heading>
                <Breadcrumb.Root>
                  <Breadcrumb.Item href="#clients">Клиенты</Breadcrumb.Item>
                </Breadcrumb.Root>
                <Page.Title>{saved.name}</Page.Title>
              </Page.Heading>
              <Page.Actions>
                <Button.Root type="submit" form={formId} loading={saving} disabled={!dirty}>
                  Сохранить
                </Button.Root>
              </Page.Actions>
            </Page.TopBar>
            <Page.Body>
              <Card.Root>
                <Card.Body>
                  <form id={formId} className={styles.fields} onSubmit={save}>
                    <Input.Root label="Название">
                      <Input.Wrapper>
                        <Input.Field value={name} onValueChange={setName} />
                      </Input.Wrapper>
                    </Input.Root>
                    <Input.Root label="Менеджер">
                      <Input.Wrapper>
                        <Input.Field value={manager} onValueChange={setManager} />
                      </Input.Wrapper>
                    </Input.Root>
                  </form>
                </Card.Body>
              </Card.Root>
            </Page.Body>
          </Page.Root>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
