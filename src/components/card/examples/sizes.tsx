/** The same record card on the five steps: padding, radius, mark, text and the controls step together — `size`. */
import {
  Badge,
  Button,
  Card,
  DescriptionList,
  Icon,
  StatusDot,
  Tooltip,
  Typography,
} from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function CardSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Card.Root size={size}>
            <Card.Header>
              <Card.Icon>
                <Icon name="object.package" />
              </Card.Icon>
              <Card.Title>Заказ № 4821</Card.Title>
              <Card.Badges>
                <Badge.Root tone="warning">Срочно</Badge.Root>
              </Card.Badges>
              <Card.Description>
                <StatusDot tone="warning">Ждёт оплаты</StatusDot>
                ООО «Северный ветер»
              </Card.Description>
              <Card.Actions>
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <Button.Root variant="soft" tone="neutral" aria-label="Открыть заказ">
                      <Button.Icon>
                        <Icon name="action.externalLink" />
                      </Button.Icon>
                    </Button.Root>
                  </Tooltip.Trigger>
                  <Tooltip.Content>Открыть заказ</Tooltip.Content>
                </Tooltip.Root>
              </Card.Actions>
            </Card.Header>
            <Card.Body>
              <DescriptionList.Root align="end">
                <DescriptionList.Item label="Менеджер">Анна Котова</DescriptionList.Item>
                <DescriptionList.Item label="Доставка">Курьер, 9 окт.</DescriptionList.Item>
              </DescriptionList.Root>
            </Card.Body>
            <Card.Footer>
              <Card.Total label="К оплате" tone="warning">
                184 500 ₽
              </Card.Total>
              <Card.Actions>
                <Button.Root>Выставить счёт</Button.Root>
              </Card.Actions>
            </Card.Footer>
          </Card.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}
