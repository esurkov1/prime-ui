/** Every mark, alone and beside a description: an icon bare and on a tile, an avatar, a progress ring, a thumbnail, a colour dot; a mark without its own size takes the row's and never grows it — `List.ItemIcon`, `List.ItemDescription`, `ProgressCircle`, `Thumbnail.Root`, `Badge.Dot`. */
import { Avatar, Badge, Icon, List, ProgressCircle, Thumbnail, Typography } from "prime-ui-kit";

const PHOTO = "https://picsum.photos/seed/list-warehouse/160/160";

export default function ListWithIconExample() {
  return (
    <div>
      <div>
        <div>
          <List.Root aria-label="Сеансы">
            <List.Item>
              <List.ItemIcon>
                <Icon name="viewport.desktop" />
              </List.ItemIcon>
              <List.ItemText>Chrome · macOS</List.ItemText>
            </List.Item>
            <List.Item>
              <List.ItemIcon>
                <Icon name="viewport.mobile" />
              </List.ItemIcon>
              <List.ItemText>Safari · iPhone</List.ItemText>
              <List.ItemDescription>Казань · вчера в 21:40</List.ItemDescription>
            </List.Item>
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            Icon
          </Typography>
        </div>
        <div>
          <List.Root aria-label="Клиенты">
            <List.Item>
              <List.ItemIcon>
                <Avatar.Root color="blue">
                  <Avatar.Fallback>ИБ</Avatar.Fallback>
                </Avatar.Root>
              </List.ItemIcon>
              <List.ItemText>Ирина Белова</List.ItemText>
            </List.Item>
            <List.Item>
              <List.ItemIcon>
                <Avatar.Root color="green">
                  <Avatar.Fallback>ПО</Avatar.Fallback>
                </Avatar.Root>
              </List.ItemIcon>
              <List.ItemText>Павел Орлов</List.ItemText>
              <List.ItemDescription>Менеджер · ООО «Лето»</List.ItemDescription>
            </List.Item>
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            Avatar.Root
          </Typography>
        </div>
        <div>
          <List.Root aria-label="Аренды">
            <List.Item>
              <List.ItemIcon>
                <ProgressCircle value={72} aria-label="Срок аренды: 72%" />
              </List.ItemIcon>
              <List.ItemText>Yamaha NMAX 155</List.ItemText>
              <List.ItemMeta>8 дней</List.ItemMeta>
            </List.Item>
            <List.Item>
              <List.ItemIcon>
                <ProgressCircle value={93} tone="warning" aria-label="Срок аренды: 93%" />
              </List.ItemIcon>
              <List.ItemText>Honda ADV 350</List.ItemText>
              <List.ItemDescription>Сергей Орлов · до 25 окт.</List.ItemDescription>
              <List.ItemMeta>2 дня</List.ItemMeta>
            </List.Item>
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            ProgressCircle
          </Typography>
        </div>
        <div>
          <List.Root aria-label="Склады">
            <List.Item>
              <List.ItemIcon>
                <Thumbnail.Root>
                  <Thumbnail.Image src={PHOTO} alt="" />
                </Thumbnail.Root>
              </List.ItemIcon>
              <List.ItemText>Склад «Север»</List.ItemText>
            </List.Item>
            <List.Item>
              <List.ItemIcon>
                <Thumbnail.Root>
                  <Thumbnail.Image src={PHOTO} alt="" />
                </Thumbnail.Root>
              </List.ItemIcon>
              <List.ItemText>Склад «Юг»</List.ItemText>
              <List.ItemDescription>Краснодар · 14 паллет</List.ItemDescription>
            </List.Item>
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            Thumbnail.Root
          </Typography>
        </div>
        <div>
          <List.Root aria-label="Проекты">
            <List.Item current>
              <List.ItemIcon>
                <Badge.Dot color="purple" />
              </List.ItemIcon>
              <List.ItemText>Внедрение CRM</List.ItemText>
              <List.ItemCount>12</List.ItemCount>
            </List.Item>
            <List.Item>
              <List.ItemIcon>
                <Badge.Dot color="teal" />
              </List.ItemIcon>
              <List.ItemText>Клиентский портал</List.ItemText>
              <List.ItemCount>4</List.ItemCount>
            </List.Item>
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            Badge.Dot
          </Typography>
        </div>
      </div>
    </div>
  );
}
