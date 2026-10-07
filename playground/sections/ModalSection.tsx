import ModalCompositionExample from "@/components/modal/examples/composition";
import compositionSource from "@/components/modal/examples/composition.tsx?raw";
import ModalControlledExample from "@/components/modal/examples/controlled";
import controlledSource from "@/components/modal/examples/controlled.tsx?raw";
import ModalFeaturesExample from "@/components/modal/examples/features";
import featuresSource from "@/components/modal/examples/features.tsx?raw";
import ModalLinkExample from "@/components/modal/examples/link";
import linkSource from "@/components/modal/examples/link.tsx?raw";
import ModalSizesExample from "@/components/modal/examples/sizes";
import sizesSource from "@/components/modal/examples/sizes.tsx?raw";
import ModalStatesExample from "@/components/modal/examples/states";
import statesSource from "@/components/modal/examples/states.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import {
  dialogAriaApiRows,
  dialogBodyApiRows,
  dialogFooterApiRows,
  dialogHeaderApiRows,
  dialogIconApiRows,
  dialogRootApiRows,
  dialogSlotApiRows,
  dialogTextApiRows,
} from "./dialogApiRows";

const modalRootApiRows: PlaygroundApiPropRow[] = [
  ...dialogRootApiRows("Modal"),
  {
    prop: "confirmOnEnter",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      "Enter нажимает действие в Modal.Confirm (кроме textarea, select, чекбоксов, шапки и самой кнопки).",
  },
  {
    prop: "onEnterConfirm",
    type: "(event: KeyboardEvent) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Свой обработчик вместо нажатия Modal.Confirm.",
  },
];

const modalContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ширина 440 · 560 · 720 · 960 px. Уже 640 px экрана любой размер открывается снизу на всю ширину.",
  },
  {
    prop: "container",
    type: "HTMLElement | null",
    defaultValue: "document.body",
    required: "Нет",
    description: "Узел для портала.",
  },
  ...dialogAriaApiRows,
];

export default function ModalSection() {
  return (
    <PageContent.Section aria-labelledby="modal-heading">
      <PageContent.Header>
        <PageContent.Title id="modal-heading">Modal</PageContent.Title>
        <PageContent.Description measure="full">
          Окно поверх страницы для подтверждений, коротких форм и важного текста. Шапка с иконкой и
          заголовком в одну строку, тело и подвал разделены еле заметными линиями; прокручивается
          только тело. Фокус удерживается внутри, страница за окном неактивна.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Анатомия</DemoSectionTitle>
            <DemoDescription>
              Шапка: <code>Modal.Icon</code> 40 px, <code>Modal.Title</code> и{" "}
              <code>Modal.Description</code>, крестик. Тело с полем и копированием, подвал с двумя
              кнопками равной ширины — для размеров <code>s</code> и <code>m</code> это{" "}
              <code>layout=&quot;fill&quot;</code> по умолчанию.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={linkSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <ModalLinkExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code> на <code>Modal.Content</code>: <code>s</code> 440 · <code>m</code>{" "}
              560 (по умолчанию) · <code>l</code> 720 · <code>xl</code> 960 px. Для <code>l</code> и{" "}
              <code>xl</code> кнопки подвала встают справа по содержимому (
              <code>layout=&quot;end&quot;</code>). Уже 640 px экрана окно открывается снизу; если
              само окно уже 360 px, кнопки встают столбиком, основная — последней.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <ModalSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Подтверждение удаления</DemoSectionTitle>
            <DemoDescription>
              Шапка и подвал без тела — линия над подвалом остаётся.{" "}
              <code>Modal.Icon tone=&quot;danger&quot;</code>, опасное действие в{" "}
              <code>Modal.Confirm</code> (Enter подтверждает), подложка не закрывает окно, на время
              запроса кнопка показывает <code>loading</code>. Рядом — информационное окно из одной
              шапки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <ModalStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Форма настроек</DemoSectionTitle>
            <DemoDescription>
              Поля получают заливку «на поверхности» и размер <code>m</code>, группы полей — шаг 20
              px. Ошибка показывается под полем без сдвига вёрстки (<code>reserveSupportRow</code>),
              первое поле получает фокус через <code>autoFocus</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={compositionSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <ModalCompositionExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              <code>open</code> и <code>onOpenChange</code> без <code>Modal.Trigger</code>: окно
              открывает код (маршрут, стор, таймер). Фокус после закрытия возвращается на элемент,
              который был активен до открытия.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={controlledSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <ModalControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Длинное содержимое и свой контейнер</DemoSectionTitle>
            <DemoDescription>
              Когда окно упирается в высоту экрана, прокручивается только <code>Modal.Body</code> —
              шапка и подвал на месте. <code>container</code> монтирует портал в заданный узел.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <ModalFeaturesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Modal.Root</DemoApiTitle>
            <DemoDescription>Состояние открытия и политика закрытия.</DemoDescription>
            <PlaygroundApiTable rows={modalRootApiRows} />
            <DemoApiTitle>Modal.Content</DemoApiTitle>
            <DemoDescription>
              Портал, подложка и сам диалог: ловушка фокуса, блокировка прокрутки, Escape.
            </DemoDescription>
            <PlaygroundApiTable rows={modalContentApiRows} />
            <DemoApiTitle>Modal.Header</DemoApiTitle>
            <PlaygroundApiTable rows={dialogHeaderApiRows} />
            <DemoApiTitle>Modal.Icon</DemoApiTitle>
            <PlaygroundApiTable rows={dialogIconApiRows} />
            <DemoApiTitle>Modal.Title · Modal.Description</DemoApiTitle>
            <PlaygroundApiTable rows={dialogTextApiRows} />
            <DemoApiTitle>Modal.Body</DemoApiTitle>
            <PlaygroundApiTable rows={dialogBodyApiRows} />
            <DemoApiTitle>Modal.Footer</DemoApiTitle>
            <PlaygroundApiTable rows={dialogFooterApiRows('"fill" для s/m, "end" для l/xl')} />
            <DemoApiTitle>Modal.Trigger · Modal.Close · Modal.Confirm</DemoApiTitle>
            <DemoDescription>
              Оборачивают один элемент: Trigger открывает, Close закрывает, Confirm делает кнопку
              целью Enter.
            </DemoDescription>
            <PlaygroundApiTable rows={dialogSlotApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
