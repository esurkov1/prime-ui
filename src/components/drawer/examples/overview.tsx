/** Order details next to the list: the three zones of every drawer — a header with a close button, a read-only body and a footer with the main action — `Drawer.Trigger`, `Drawer.Body`, `Drawer.Footer`. */
import { Button, DescriptionList, Drawer } from "prime-ui-kit";

const DETAILS = [
  { term: "Клиент", value: "Анна Смирнова" },
  { term: "Сумма", value: "12 480 ₽" },
  { term: "Доставка", value: "Курьер, 5 октября" },
  { term: "Статус", value: "Собирается на складе" },
];

export default function DrawerOverviewExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Заказ № 1042
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content size="s">
        <Drawer.Header>
          <Drawer.Title number="№ 1042">Заказ</Drawer.Title>
          <Drawer.Description>Оформлен 3 октября</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <DescriptionList.Root>
            {DETAILS.map(({ term, value }) => (
              <DescriptionList.Item key={term} label={term}>
                {value}
              </DescriptionList.Item>
            ))}
          </DescriptionList.Root>
        </Drawer.Body>
        <Drawer.Footer>
          <Button.Root>Изменить заказ</Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
