import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";

const providerRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: 'ControlSurfaceSize ("xs" | "s" | "m" | "l" | "xl")',
    defaultValue: "—",
    required: "Да",
    description:
      "Размер «контрольной поверхности» для каскада в дочерние компоненты (например Icon без явного size).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Поддерево, внутри которого читается контекст.",
  },
];

export default function ControlSizeSection() {
  return (
    <PlaygroundDocPage
      title="ControlSizeProvider"
      description={
        <>
          React-контекст размера контрольной поверхности: передаёт номинальный размер (
          <code>xs</code>–<code>xl</code>) вниз по дереву, чтобы дочерние элементы (в частности{" "}
          <code>Icon</code> без явного <code>size</code>) наследовали ритм поля или кнопки. Хук{" "}
          <code>useOptionalControlSize</code> читает значение. Для Badge/Tag/Kbd значение{" "}
          <code>xs</code> с контекста приводится к визуальному <code>s</code>. Отдельного раздела с
          превью в плейграунде нет — контекст проявляется внутри других компонентов (см. например
          Kbd, документацию по наследованию размера).
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>ControlSizeProvider</DemoApiTitle>
          <PlaygroundApiTable rows={providerRows} />
          <DemoApiTitle>useOptionalControlSize()</DemoApiTitle>
          <DemoDescription>
            Параметров нет. Возвращает <code>ControlSurfaceSize | undefined</code>: размер из
            ближайшего <code>ControlSizeProvider</code> или <code>undefined</code> вне провайдера.
            Используется в <code>Icon</code> и согласованных контролах.
          </DemoDescription>
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
