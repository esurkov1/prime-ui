/** Chats of the assistant: a new-chat action above a long list of threads with their time, a search over them, a fixed width and a height of twelve rows — `Dropdown.Search`, `Dropdown.ItemMeta`, `persistent`, `width`, `maxRows`. */
import { Button, Dropdown, Icon } from "prime-ui-kit";

const TODAY = [
  { id: "t1", title: "Сверка счетов за сентябрь с бухгалтерией", time: "14:32" },
  { id: "t2", title: "Почему просел этап «Оплата» в воронке", time: "13:05" },
  { id: "t3", title: "Письмо клиенту о переносе поставки", time: "11:48" },
  { id: "t4", title: "Список просроченных заказов по складу Казань", time: "10:20" },
  { id: "t5", title: "Шаблон договора для новых партнёров", time: "09:14" },
];

const EARLIER = [
  { id: "t6", title: "Квартальный отчёт по выручке", time: "вчера" },
  { id: "t7", title: "Возвраты за август: причины и суммы", time: "вчера" },
  { id: "t8", title: "Ответ на претензию ООО «Северный ветер»", time: "пн" },
  { id: "t9", title: "Расчёт скидки для оптового заказа", time: "пн" },
  { id: "t10", title: "Сценарий звонка для отдела продаж", time: "вс" },
  { id: "t11", title: "Сравнение тарифов доставки", time: "сб" },
  { id: "t12", title: "Повестка планёрки команды поддержки", time: "12 окт" },
  { id: "t13", title: "Проверка остатков перед акцией", time: "11 окт" },
  { id: "t14", title: "Текст рассылки о новом каталоге", time: "10 окт" },
  { id: "t15", title: "Сводка обращений за неделю", time: "9 окт" },
  { id: "t16", title: "Инструкция по выгрузке в 1С", time: "8 окт" },
  { id: "t17", title: "Анализ оттока клиентов", time: "5 окт" },
  { id: "t18", title: "Подготовка к аудиту склада", time: "3 окт" },
  { id: "t19", title: "Договор аренды офиса: замечания юриста", time: "1 окт" },
  { id: "t20", title: "Бюджет на рекламу в четвёртом квартале", time: "28 сен" },
];

export default function DropdownSearchExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="soft" tone="neutral">
          <Button.Icon>
            <Icon name="object.message" />
          </Button.Icon>
          Чаты
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content width="m" maxRows={12}>
        <Dropdown.Search />
        <Dropdown.Item persistent>
          <Dropdown.ItemIcon>
            <Icon name="action.add" />
          </Dropdown.ItemIcon>
          Новый чат
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Group label="Сегодня">
          {TODAY.map((thread) => (
            <Dropdown.Item key={thread.id}>
              {thread.title}
              <Dropdown.ItemMeta>{thread.time}</Dropdown.ItemMeta>
            </Dropdown.Item>
          ))}
        </Dropdown.Group>
        <Dropdown.Group label="Ранее">
          {EARLIER.map((thread) => (
            <Dropdown.Item key={thread.id}>
              {thread.title}
              <Dropdown.ItemMeta>{thread.time}</Dropdown.ItemMeta>
            </Dropdown.Item>
          ))}
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
