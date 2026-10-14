/** Every size tier: row height, text, icon and count follow the tier — `size`. */
import { Icon, List, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ListSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <List.Root size={size} aria-label={`Очереди, ${size}`}>
              <List.Item current>
                <List.ItemIcon>
                  <Icon name="object.inbox" />
                </List.ItemIcon>
                <List.ItemText>Входящие</List.ItemText>
                <List.ItemCount color="blue">12</List.ItemCount>
              </List.Item>
              <List.Item>
                <List.ItemIcon>
                  <Icon name="status.sent" />
                </List.ItemIcon>
                <List.ItemText>Отправленные</List.ItemText>
              </List.Item>
            </List.Root>
            <Typography as="span" variant="caption" tone="muted">
              {size}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
