/** A fleet calendar by kind of bar: rentals, bookings and service share a legend and a view menu that hides a kind from the chart and from the legend at once — `categories`, `legend`, `hiddenCategories`, `GanttCategoriesMenu`. */
import { addDays, startOfToday } from "date-fns";
import { Gantt, type GanttBar, GanttCategoriesMenu, type GanttCategory } from "prime-ui-kit";
import * as React from "react";

type Vehicle = { id: string; name: string; bars: GanttBar[] };

const TODAY = startOfToday();
const at = (days: number) => addDays(TODAY, days);

/** The kinds of bars of the fleet calendar, in legend order. */
const CATEGORIES: GanttCategory[] = [
  { id: "rental", label: "Аренды", color: "green" },
  { id: "booking", label: "Брони", color: "blue" },
  { id: "service", label: "Сервис", color: "orange" },
];

const FLEET: Vehicle[] = [
  {
    id: "e-101",
    name: "Электровелосипед E-101",
    bars: [
      {
        id: "r-1",
        label: "Аренда · ООО «Курьер Плюс»",
        start: at(-3),
        end: at(4),
        category: "rental",
      },
      { id: "b-1", label: "Бронь · Смирнова", start: at(6), end: at(10), category: "booking" },
    ],
  },
  {
    id: "e-102",
    name: "Электровелосипед E-102",
    bars: [
      { id: "b-2", label: "Бронь · ИП Гусев", start: at(1), end: at(5), category: "booking" },
      { id: "s-1", label: "Сервис · тормоза", start: at(7), end: at(9), category: "service" },
    ],
  },
  {
    id: "s-201",
    name: "Самокат S-201",
    bars: [
      { id: "r-2", label: "Аренда · Ковалёв", start: at(-1), end: at(2), category: "rental" },
      { id: "s-2", label: "Сервис · диагностика", start: at(3), end: at(4), category: "service" },
    ],
  },
];

export default function GanttCategoriesExample() {
  const [hiddenCategories, setHiddenCategories] = React.useState<readonly string[]>([]);

  return (
    <Gantt
      aria-label="Календарь парка"
      defaultZoom="day"
      today={TODAY}
      rows={FLEET}
      getRowKey={(vehicle) => vehicle.id}
      getRowLabel={(vehicle) => vehicle.name}
      getRowBars={(vehicle) => vehicle.bars}
      categories={CATEGORIES}
      legend
      hiddenCategories={hiddenCategories}
      toolbar={
        <GanttCategoriesMenu
          categories={CATEGORIES}
          hiddenCategories={hiddenCategories}
          onHiddenCategoriesChange={setHiddenCategories}
        />
      }
    />
  );
}
