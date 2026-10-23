/** A header row per section: the mark, the title with its badge, the state and a note under it, the chevron at the end; the content lines up with the title — `Accordion.Icon`, `Accordion.Badges`, `Accordion.Description`. */
import { Accordion, Badge, Icon, StatusDot, Typography } from "prime-ui-kit";

const SECTIONS = [
  {
    value: "calendar",
    title: "Расписание отчётов",
    icon: "field.calendar",
    badge: "Еженедельно",
    state: { tone: "success", label: "Включено" },
    note: "Следующая сводка в понедельник",
    text: "Сводка уходит по понедельникам в 9:00.",
  },
  {
    value: "mail",
    title: "Рассылки",
    icon: "field.email",
    badge: null,
    state: { tone: "neutral", label: "Выключено" },
    note: "Письма о заказах не уходят",
    text: "Письма о новых заказах и возвратах.",
  },
  {
    value: "access",
    title: "Доступ",
    icon: "status.locked",
    badge: "Только админы",
    state: { tone: "warning", label: "Ограничено" },
    note: "4 человека видят отчёты",
    text: "Кто из команды видит финансовые отчёты.",
  },
] as const;

export default function AccordionWithIconExample() {
  return (
    <div>
      <div>
        <Accordion.Root defaultValue="calendar">
          {SECTIONS.map((section) => (
            <Accordion.Item key={section.value} value={section.value}>
              <Accordion.Header>
                <Accordion.Trigger>
                  <Accordion.Icon>
                    <Icon name={section.icon} />
                  </Accordion.Icon>
                  {section.title}
                  {section.badge ? (
                    <Accordion.Badges>
                      <Badge.Root>{section.badge}</Badge.Root>
                    </Accordion.Badges>
                  ) : null}
                  <Accordion.Description>
                    <StatusDot tone={section.state.tone}>{section.state.label}</StatusDot>
                    {section.note}
                  </Accordion.Description>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>{section.text}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
        <Typography as="span" variant="caption" tone="muted">
          Accordion.Icon · Accordion.Badges · Accordion.Description
        </Typography>
      </div>
    </div>
  );
}
