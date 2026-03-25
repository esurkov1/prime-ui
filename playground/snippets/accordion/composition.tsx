import { CircleHelp, MapPin, User } from "lucide-react";
import { Accordion } from "@/components/accordion/Accordion";

export default function AccordionCompositionSnippet() {
  return (
    <Accordion.Root type="single" size="m" className="accordionDemo" defaultValue="a">
      <Accordion.Item value="a">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={User} />
            <span>Аккаунт</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="accordionContentDemo">
          Пароль, сессии и способ входа.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={CircleHelp} />
            <span>Справка</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="accordionContentDemo">
          Ответы по тарифам и поддержке.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="c">
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Icon as={MapPin} />
            <span>Локации</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="accordionContentDemo">
          Регионы обслуживания и юрисдикция данных.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
