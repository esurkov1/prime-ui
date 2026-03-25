import { Minus, Plus } from "lucide-react";
import { Accordion } from "@/components/accordion/Accordion";

export default function AccordionFeaturesArrowSnippet() {
  return (
    <Accordion.Root type="single" size="m" className="accordionDemo" defaultValue="a">
      <Accordion.Item value="a">
        <Accordion.Header>
          <Accordion.Trigger>
            Смена иконок открыто/закрыто
            <Accordion.Arrow openIcon={Plus} closeIcon={Minus} />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Пропсы <code>openIcon</code> и <code>closeIcon</code> на <code>Accordion.Arrow</code>: два
          разных символа вместо поворота одной стрелки.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Header>
          <Accordion.Trigger>
            Обычная стрелка
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Поведение по умолчанию — <code>ChevronDown</code> с поворотом.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
