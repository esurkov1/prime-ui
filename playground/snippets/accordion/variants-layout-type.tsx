import { Accordion } from "@/components/accordion/Accordion";

import styles from "./accordion-demos.module.css";

function SettingsItems() {
  return (
    <>
      <Accordion.Item value="one">
        <Accordion.Header>
          <Accordion.Trigger>
            Общие
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Язык интерфейса и часовой пояс.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Header>
          <Accordion.Trigger>
            Уведомления
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Каналы и частота напоминаний.</Accordion.Content>
      </Accordion.Item>
    </>
  );
}

export default function AccordionVariantsLayoutTypeSnippet() {
  return (
    <div className="stack">
      <div className="grid2">
        <div>
          <p className={`previewCaption ${styles.captionSpacer}`}>
            <code>layout=&quot;grouped&quot;</code> (по умолчанию) — единая рамка, пункты без
            зазоров.
          </p>
          <Accordion.Root type="single" defaultValue="one" className="accordionDemo">
            <SettingsItems />
          </Accordion.Root>
        </div>
        <div>
          <p className={`previewCaption ${styles.captionSpacer}`}>
            <code>layout=&quot;separate&quot;</code> — отдельные карточки с отступами.
          </p>
          <Accordion.Root
            type="single"
            layout="separate"
            defaultValue="one"
            className="accordionDemo"
          >
            <SettingsItems />
          </Accordion.Root>
        </div>
      </div>

      <div>
        <p className={`previewCaption ${styles.captionSpacer}`}>
          <code>type=&quot;multiple&quot;</code> — можно держать открытыми несколько разделов сразу
          (<code>defaultValue</code> как массив).
        </p>
        <Accordion.Root type="multiple" defaultValue={["doc", "ship"]} className="accordionDemo">
          <Accordion.Item value="doc">
            <Accordion.Header>
              <Accordion.Trigger>
                Документы
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Договоры и акты в одном месте.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="ship">
            <Accordion.Header>
              <Accordion.Trigger>
                Доставка
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Службы и сроки по регионам.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="pay">
            <Accordion.Header>
              <Accordion.Trigger>
                Оплата
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Способы оплаты и выставление счетов.</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}
