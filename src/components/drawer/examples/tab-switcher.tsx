/** A model card with tabs: one switcher for the whole open tab stands in the header before the record's icon buttons — the text language on the description tab, the period on the analytics tab, whose two self-titled charts the panel spaces by itself — `Drawer.Actions`, `Tabs.Root`, `Tabs.Panel`. */
import {
  Button,
  Datepicker,
  type DatepickerRange,
  DEFAULT_DATEPICKER_PRESETS,
  DescriptionList,
  Drawer,
  Icon,
  Kpi,
  SegmentedControl,
  Sparkline,
  type SparklinePoint,
  Tabs,
  Tooltip,
  useSparkline,
} from "prime-ui-kit";
import * as React from "react";

const MODEL = {
  name: "Кресло «Орион»",
  sku: "OR-240",
  summary: "Офисные кресла · 140 шт. на складе",
  description: {
    ru: "Офисное кресло с сетчатой спинкой и поддержкой поясницы. Подлокотники регулируются в четырёх направлениях, механизм качания фиксируется в пяти положениях.",
    en: "An office chair with a mesh back and lumbar support. The armrests adjust in four directions, the tilt locks in five positions.",
  },
  title: { ru: "Кресло «Орион», графит", en: "Orion chair, graphite" },
};

const SOLD: SparklinePoint[] = [
  { label: "май", value: 52 },
  { label: "июн", value: 61 },
  { label: "июл", value: 58 },
  { label: "авг", value: 74 },
  { label: "сен", value: 83 },
  { label: "окт", value: 90 },
];

const RETURNS: SparklinePoint[] = [
  { label: "май", value: 2 },
  { label: "июн", value: 1 },
  { label: "июл", value: 0 },
  { label: "авг", value: 1 },
  { label: "сен", value: 1 },
  { label: "окт", value: 1 },
];

const formatPieces = (value: number) => `${value.toLocaleString("ru-RU")} шт.`;

const ALL_TIME: DatepickerRange = { from: null, to: null };

type Lang = "ru" | "en";

export default function DrawerTabSwitcherExample() {
  const [tab, setTab] = React.useState("description");
  const [lang, setLang] = React.useState<Lang>("ru");
  const [period, setPeriod] = React.useState<DatepickerRange>(ALL_TIME);
  const sold = useSparkline({ data: SOLD, summary: "sum", formatValue: formatPieces });
  const returned = useSparkline({ data: RETURNS, summary: "sum", formatValue: formatPieces });

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть модель
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Drawer.Header>
            <Drawer.Title number={MODEL.sku}>{MODEL.name}</Drawer.Title>
            <Drawer.Description>{MODEL.summary}</Drawer.Description>
            <Drawer.Actions>
              {tab === "description" ? (
                <SegmentedControl.Root
                  aria-label="Язык текстов"
                  value={lang}
                  onValueChange={(next) => setLang(next as Lang)}
                >
                  <SegmentedControl.Item value="ru">RU</SegmentedControl.Item>
                  <SegmentedControl.Item value="en">EN</SegmentedControl.Item>
                </SegmentedControl.Root>
              ) : (
                <Datepicker.Root
                  mode="range"
                  aria-label="Период"
                  placeholder="Всё время"
                  value={period}
                  onValueChange={setPeriod}
                  resetValue={ALL_TIME}
                  presets={DEFAULT_DATEPICKER_PRESETS}
                  disableFuture
                  align="end"
                />
              )}
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Button.Root variant="ghost" tone="neutral" aria-label="Дублировать модель">
                    <Button.Icon>
                      <Icon name="action.copy" />
                    </Button.Icon>
                  </Button.Root>
                </Tooltip.Trigger>
                <Tooltip.Content>Дублировать модель</Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Button.Root variant="ghost" tone="neutral" aria-label="Снять с продажи">
                    <Button.Icon>
                      <Icon name="action.powerOff" />
                    </Button.Icon>
                  </Button.Root>
                </Tooltip.Trigger>
                <Tooltip.Content>Снять с продажи</Tooltip.Content>
              </Tooltip.Root>
            </Drawer.Actions>
            <Tabs.List aria-label={MODEL.name}>
              <Tabs.Item value="description">Описание</Tabs.Item>
              <Tabs.Item value="analytics">Аналитика</Tabs.Item>
            </Tabs.List>
          </Drawer.Header>
          <Drawer.Body>
            <Tabs.Panel value="description">
              <DescriptionList.Root>
                <DescriptionList.Item label="Название на сайте">
                  {MODEL.title[lang]}
                </DescriptionList.Item>
                <DescriptionList.Item label="Описание">
                  {MODEL.description[lang]}
                </DescriptionList.Item>
              </DescriptionList.Root>
            </Tabs.Panel>
            <Tabs.Panel value="analytics">
              <Kpi.Root valueSize="m">
                <Kpi.Title>Продажи</Kpi.Title>
                <Kpi.Description>По месяцам, в штуках</Kpi.Description>
                <Kpi.Value>{sold.valueText}</Kpi.Value>
                <Kpi.Media>
                  <Sparkline {...sold.plot} label="Продано по месяцам" />
                </Kpi.Media>
              </Kpi.Root>
              <Kpi.Root valueSize="m">
                <Kpi.Title>Возвраты</Kpi.Title>
                <Kpi.Description>По месяцам, в штуках</Kpi.Description>
                <Kpi.Value>{returned.valueText}</Kpi.Value>
                <Kpi.Media>
                  <Sparkline {...returned.plot} label="Возвращено по месяцам" />
                </Kpi.Media>
              </Kpi.Root>
            </Tabs.Panel>
          </Drawer.Body>
        </Tabs.Root>
      </Drawer.Content>
    </Drawer.Root>
  );
}
