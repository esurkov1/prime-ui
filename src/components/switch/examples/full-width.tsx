/** Settings rows with the text at the start and the track at the end, one with a hint — `fullWidth`, `hint`. */
import { Card, Switch } from "prime-ui-kit";

const SETTINGS = [
  {
    label: "Уведомления о новых заказах",
    hint: "Письмо и пуш при каждом оформленном заказе",
    on: true,
  },
  { label: "Автоматический счёт покупателю", hint: undefined, on: true },
  { label: "Напоминания об оплате", hint: undefined, on: false },
];

export default function SwitchFullWidthExample() {
  return (
    <Card.Root>
      <Card.Body>
        {SETTINGS.map((setting) => (
          <Switch.Root
            key={setting.label}
            fullWidth
            defaultChecked={setting.on}
            hint={setting.hint}
          >
            <Switch.Label>{setting.label}</Switch.Label>
          </Switch.Root>
        ))}
      </Card.Body>
    </Card.Root>
  );
}
