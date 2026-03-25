import { Tabs } from "@/components/tabs/Tabs";

/**
 * У `Tabs.Label` в стилях заданы min-width: 0 и ellipsis — длинная подпись обрезается
 * в узком контейнере, не ломая горизонтальный ряд триггеров.
 */
export default function TabsLongLabelsSnippet() {
  return (
    <div className="max-w-[240px] min-w-0">
      <Tabs.Root defaultValue="short">
        <Tabs.List>
          <Tabs.Tab value="short">
            <Tabs.Label>Кратко</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="long">
            <Tabs.Label>Очень длинное название раздела, которое не помещается целиком</Tabs.Label>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="short">Короткая вкладка.</Tabs.Panel>
        <Tabs.Panel value="long">
          Вкладка с длинной подписью: текст в триггере сокращается многоточием.
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
