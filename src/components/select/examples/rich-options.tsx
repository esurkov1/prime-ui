/** Options with a picture, a second line and a price; the trigger draws the picked option with the same parts — `renderValue`, `Select.ItemText`, `Select.ItemDescription`, `Select.ItemMeta`. */
import { Icon, type PaletteColor, Select, Thumbnail } from "prime-ui-kit";

type Tariff = { value: string; title: string; terms: string; price: string; color: PaletteColor };

const TARIFFS: Tariff[] = [
  {
    value: "courier",
    title: "Курьер",
    terms: "Завтра, 10:00–18:00",
    price: "450 ₽",
    color: "blue",
  },
  {
    value: "express",
    title: "Экспресс",
    terms: "Сегодня за 2 часа",
    price: "890 ₽",
    color: "orange",
  },
  { value: "pickup", title: "Пункт выдачи", terms: "Через 2 дня", price: "190 ₽", color: "green" },
  {
    value: "freight",
    title: "Грузовой",
    terms: "От 3 дней, до 1 т",
    price: "2 400 ₽",
    color: "purple",
  },
];

const BY_VALUE = new Map(TARIFFS.map((tariff) => [tariff.value, tariff]));

export default function SelectRichOptionsExample() {
  return (
    <Select.Root label="Доставка" defaultValue="courier" placeholder="Выберите тариф">
      <Select.Trigger>
        <Select.Value
          renderValue={({ value, label }) => {
            const tariff = BY_VALUE.get(value);
            return (
              <>
                <Thumbnail.Root color={tariff?.color}>
                  <Thumbnail.Fallback>
                    <Icon name="object.truck" />
                  </Thumbnail.Fallback>
                </Thumbnail.Root>
                <Select.ItemText>{label}</Select.ItemText>
                <Select.ItemDescription>
                  {tariff?.terms} · {tariff?.price}
                </Select.ItemDescription>
              </>
            );
          }}
        />
      </Select.Trigger>
      <Select.Content>
        {TARIFFS.map((tariff) => (
          <Select.Item key={tariff.value} value={tariff.value}>
            <Thumbnail.Root color={tariff.color}>
              <Thumbnail.Fallback>
                <Icon name="object.truck" />
              </Thumbnail.Fallback>
            </Thumbnail.Root>
            <Select.ItemText>{tariff.title}</Select.ItemText>
            <Select.ItemDescription>{tariff.terms}</Select.ItemDescription>
            <Select.ItemMeta>{tariff.price}</Select.ItemMeta>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
