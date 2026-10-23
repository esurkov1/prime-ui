/** Every size tier: a row 28 to 48 tall, with a description 44 to 68; the mark, the text, the count and the controls follow the tier — `size`. */
import { Avatar, Icon, List, Switch, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ListSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <List.Root size={size} aria-label={`Клиенты, ${size}`}>
              <List.Item current>
                <List.ItemIcon>
                  <Icon name="object.inbox" />
                </List.ItemIcon>
                <List.ItemText>Входящие</List.ItemText>
                <List.ItemCount color="blue">12</List.ItemCount>
              </List.Item>
              <List.Item>
                <List.ItemIcon>
                  <Avatar.Root color="purple">
                    <Avatar.Fallback>ИБ</Avatar.Fallback>
                  </Avatar.Root>
                </List.ItemIcon>
                <List.ItemText>Ирина Белова</List.ItemText>
                <List.ItemDescription>Юрист · ООО «Гранит»</List.ItemDescription>
                <List.ItemActions>
                  <Switch.Root aria-label="Уведомления для Ирины Беловой" defaultChecked />
                </List.ItemActions>
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
