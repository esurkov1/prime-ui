/** Rich options with ItemMedia, ItemText, ItemDescription and ItemMeta, and the trigger rendering the selected option via a Select.Value function. Use it when options need a thumbnail, a second line or a price. */
import { Bike } from "lucide-react";
import { type PaletteColor, Select } from "prime-ui-kit";

type Vehicle = {
  value: string;
  title: string;
  kind: string;
  price: string;
  color: PaletteColor;
};

const vehicles: Vehicle[] = [
  { value: "nmax", title: "Yamaha NMAX 155", kind: "Скутер", price: "250 ฿ / день", color: "blue" },
  { value: "pcx", title: "Honda PCX 160", kind: "Скутер", price: "250 ฿ / день", color: "sky" },
  {
    value: "adv160",
    title: "Honda ADV 160",
    kind: "Скутер",
    price: "300 ฿ / день",
    color: "green",
  },
  {
    value: "adv350",
    title: "Honda ADV 350",
    kind: "Максискутер",
    price: "450 ฿ / день",
    color: "teal",
  },
  {
    value: "forza",
    title: "Honda Forza 350",
    kind: "Максискутер",
    price: "450 ฿ / день",
    color: "purple",
  },
  {
    value: "xmax",
    title: "Yamaha XMAX 300",
    kind: "Максискутер",
    price: "450 ฿ / день",
    color: "orange",
  },
  {
    value: "xadv",
    title: "Honda X-ADV 750",
    kind: "Премиум",
    price: "1 300 ฿ / день",
    color: "red",
  },
  {
    value: "tmax",
    title: "Yamaha TMAX 560",
    kind: "Премиум",
    price: "1 200 ฿ / день",
    color: "pink",
  },
];

const byValue = new Map(vehicles.map((v) => [v.value, v]));

export default function SelectRichOptionsExample() {
  return (
    <Select.Root label="Байк" defaultValue="adv160" placeholder="Выберите байк">
      <Select.Trigger>
        <Select.Value>
          {({ value }) => {
            const v = byValue.get(value);
            if (!v) return value;
            return (
              <>
                <Select.ItemMedia color={v.color}>
                  <Bike />
                </Select.ItemMedia>
                <Select.ItemText>{v.title}</Select.ItemText>
                <Select.ItemDescription>
                  {v.kind} · {v.price}
                </Select.ItemDescription>
              </>
            );
          }}
        </Select.Value>
      </Select.Trigger>
      <Select.Content searchable>
        {vehicles.map((v) => (
          <Select.Item key={v.value} value={v.value}>
            <Select.ItemMedia color={v.color}>
              <Bike />
            </Select.ItemMedia>
            <Select.ItemText>{v.title}</Select.ItemText>
            <Select.ItemDescription>{v.kind}</Select.ItemDescription>
            <Select.ItemMeta>{v.price}</Select.ItemMeta>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
