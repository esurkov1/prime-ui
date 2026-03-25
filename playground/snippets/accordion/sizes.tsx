import { Accordion } from "@/components/accordion/Accordion";
import type { AccordionSize } from "@/internal/states";

function AccordionRow({ size, label }: { size: AccordionSize; label: string }) {
  return (
    <Accordion.Root type="single" size={size} className="accordionDemo">
      <Accordion.Item value="one">
        <Accordion.Header>
          <Accordion.Trigger>
            {label}
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Контент масштабируется по токенам размера {size}.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export default function AccordionSizesSnippet() {
  return (
    <>
      <AccordionRow size="s" label="Размер s" />
      <AccordionRow size="m" label="Размер m (по умолчанию)" />
      <AccordionRow size="l" label="Размер l" />
      <AccordionRow size="xl" label="Размер xl" />
    </>
  );
}
