/** A vehicle's panel headed by its photo: the name and the plate beside the picture, a line of data under them, and the status badges starting under the photo, at the header's edge — `Drawer.Icon`, `Thumbnail.Root`, `Drawer.Badges`. */
import { Badge, Button, DescriptionList, Drawer, Icon, Thumbnail } from "prime-ui-kit";

const PHOTO = "https://picsum.photos/seed/pcx/320/180";

const UNIT = {
  name: "Honda PCX 160 · 2024",
  plate: "ภก 5678",
  note: "Банг Тао · пробег 12 480 км",
  client: "Анна Соколова",
  term: "15 окт – 29 окт",
  deposit: "150 $",
};

export default function DrawerRecordPictureExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть транспорт
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Icon>
            <Thumbnail.Root ratio="16:9" color="gray">
              <Thumbnail.Image src={PHOTO} />
              <Thumbnail.Fallback>
                <Icon name="object.motorbike" />
              </Thumbnail.Fallback>
            </Thumbnail.Root>
          </Drawer.Icon>
          <Drawer.Title number={UNIT.plate}>{UNIT.name}</Drawer.Title>
          <Drawer.Description>{UNIT.note}</Drawer.Description>
          <Drawer.Badges>
            <Badge.Root color="purple">В аренде до 29 окт</Badge.Root>
            <Badge.Root color="green">{`Депозит ${UNIT.deposit}`}</Badge.Root>
          </Drawer.Badges>
        </Drawer.Header>
        <Drawer.Body>
          <Drawer.Section label="Аренда">
            <DescriptionList.Root>
              <DescriptionList.Item label="Клиент">{UNIT.client}</DescriptionList.Item>
              <DescriptionList.Item label="Срок">{UNIT.term}</DescriptionList.Item>
              <DescriptionList.Item label="Депозит">{UNIT.deposit}</DescriptionList.Item>
            </DescriptionList.Root>
          </Drawer.Section>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
