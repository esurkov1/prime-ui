import { Accordion } from "@/components/accordion/Accordion";

export default function AccordionFullWidthSnippet() {
  return (
    <Accordion.Root type="single" size="m" defaultValue="block" className="examplePreviewBleed">
      <Accordion.Item value="block">
        <Accordion.Header>
          <Accordion.Trigger>
            Растяжение на ширину контейнера
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Корень без ограничения <code>max-width</code> заполняет колонку превью: удобно в боковой
          панели, широкой карточке или адаптивной сетке.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="next">
        <Accordion.Header>
          <Accordion.Trigger>
            Второй пункт
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Тот же блок тянется вместе с родителем.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
