/** Order details in a Drawer: the tab bar runs along the bottom of the header and scrolls sideways when the tabs outgrow the drawer, the active tab is the body rising into it, every panel is the body's own content, and the delivery form keeps its edits across tabs — `Tabs.Root`, `Tabs.List`, `Tabs.Panel`, `keepMounted`. */
import { Badge, Button, DescriptionList, Drawer, Fieldset, Input, Tabs } from "prime-ui-kit";

const ITEMS = [
  { name: "Кресло «Орион», графит", amount: "2 × 18 900 ₽" },
  { name: "Стол «Лофт 140»", amount: "1 × 24 500 ₽" },
  { name: "Сборка и подъём на этаж", amount: "1 × 3 200 ₽" },
];

const DOCUMENTS = [
  { name: "Счёт № 1042-С", date: "3 октября" },
  { name: "Накладная № 1042-Н", date: "4 октября" },
];

const HISTORY = [
  { time: "3 октября, 10:14", event: "Заказ оформлен" },
  { time: "3 октября, 10:20", event: "Оплата прошла" },
  { time: "4 октября, 16:02", event: "Передан на склад" },
];

export default function TabsInDrawerExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Заказ № 1042
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Tabs.Root defaultValue="summary">
          <Drawer.Header>
            <Drawer.Title number="№ 1042">Заказ</Drawer.Title>
            <Drawer.Description>Оформлен 3 октября · 65 500 ₽</Drawer.Description>
            <Tabs.List aria-label="Заказ № 1042">
              <Tabs.Item value="summary">Сводка</Tabs.Item>
              <Tabs.Item value="items">
                <Tabs.Label>Товары</Tabs.Label>
                <Tabs.Count>{ITEMS.length}</Tabs.Count>
              </Tabs.Item>
              <Tabs.Item value="delivery">Доставка</Tabs.Item>
              <Tabs.Item value="documents">Документы</Tabs.Item>
              <Tabs.Item value="history">История</Tabs.Item>
            </Tabs.List>
          </Drawer.Header>
          <Drawer.Body>
            <Tabs.Panel value="summary">
              <DescriptionList.Root>
                <DescriptionList.Item label="Клиент">Анна Смирнова</DescriptionList.Item>
                <DescriptionList.Item label="Статус">
                  <Badge.Root tone="info">Собирается на складе</Badge.Root>
                </DescriptionList.Item>
                <DescriptionList.Item label="Оплата">Картой, 3 октября</DescriptionList.Item>
                <DescriptionList.Item label="Менеджер">Илья Соколов</DescriptionList.Item>
              </DescriptionList.Root>
            </Tabs.Panel>

            <Tabs.Panel value="items">
              <DescriptionList.Root>
                {ITEMS.map((item) => (
                  <DescriptionList.Item key={item.name} label={item.name}>
                    {item.amount}
                  </DescriptionList.Item>
                ))}
              </DescriptionList.Root>
            </Tabs.Panel>

            <Tabs.Panel value="delivery" keepMounted>
              <Fieldset aria-label="Доставка">
                <Input.Root label="Адрес">
                  <Input.Wrapper>
                    <Input.Field defaultValue="Москва, Ленинградский проспект, 37, кв. 12" />
                  </Input.Wrapper>
                </Input.Root>
                <Input.Root label="Комментарий курьеру" hint="Виден курьеру в приложении">
                  <Input.Wrapper>
                    <Input.Field defaultValue="Позвонить за час" />
                  </Input.Wrapper>
                </Input.Root>
              </Fieldset>
            </Tabs.Panel>

            <Tabs.Panel value="documents">
              <DescriptionList.Root>
                {DOCUMENTS.map((document) => (
                  <DescriptionList.Item key={document.name} label={document.name}>
                    {document.date}
                  </DescriptionList.Item>
                ))}
              </DescriptionList.Root>
            </Tabs.Panel>

            <Tabs.Panel value="history">
              <DescriptionList.Root>
                {HISTORY.map((entry) => (
                  <DescriptionList.Item key={entry.time} label={entry.time}>
                    {entry.event}
                  </DescriptionList.Item>
                ))}
              </DescriptionList.Root>
            </Tabs.Panel>
          </Drawer.Body>
        </Tabs.Root>
        <Drawer.Footer>
          <Button.Root>Изменить заказ</Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
