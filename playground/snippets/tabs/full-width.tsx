import { Tabs } from "@/components/tabs/Tabs";

/**
 * Отдельного пропа fullWidth нет: корень и список тянутся через className у родителя
 * (`width: 100%` / утилиты вроде `w-full`). Триггеры делят строку поровну через `flex-1`.
 */
export default function TabsFullWidthSnippet() {
  return (
    <div className="w-full max-w-lg rounded-lg border border-[var(--prime-sys-color-border-subtle)] p-3">
      <Tabs.Root defaultValue="sales" className="w-full min-w-0">
        <Tabs.List className="w-full min-w-0">
          <Tabs.Tab value="sales" className="min-w-0 flex-1 justify-center">
            <Tabs.Label>Продажи</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="stock" className="min-w-0 flex-1 justify-center">
            <Tabs.Label>Склад</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="clients" className="min-w-0 flex-1 justify-center">
            <Tabs.Label>Клиенты</Tabs.Label>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="sales">Панель «Продажи» на ширину карточки.</Tabs.Panel>
        <Tabs.Panel value="stock">Панель «Склад».</Tabs.Panel>
        <Tabs.Panel value="clients">Панель «Клиенты».</Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
