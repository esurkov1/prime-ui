/** A fleet calendar: an issued rental changes only its end, a booking moves and changes both edges, a long booking is a two-line bar with its deposit, documents and an inspection are short bars in a lane under the main ones, a new booking is drawn in a free lane — `edit`, `height`, `description`, `onBarChange`, `onBarCreate`. */
import { addDays, startOfToday } from "date-fns";
import { Gantt, type GanttBar, type GanttDates } from "prime-ui-kit";
import * as React from "react";

type Vehicle = { id: string; name: string; bars: GanttBar[] };

const TODAY = startOfToday();
const at = (days: number) => addDays(TODAY, days);

/** The vehicle is with the client already: the start is history, only the return date may move. */
const issued = (id: string, client: string, from: number, to: number): GanttBar => ({
  id,
  label: `Выдан · ${client}`,
  start: at(from),
  end: at(to),
  color: "green",
  edit: "end",
});

const booking = (id: string, client: string, from: number, to: number): GanttBar => ({
  id,
  label: `Бронь · ${client}`,
  start: at(from),
  end: at(to),
  color: "blue",
});

const FLEET: Vehicle[] = [
  {
    id: "e-101",
    name: "Электровелосипед E-101",
    bars: [issued("r-1", "ООО «Курьер Плюс»", -3, 4), booking("b-1", "Смирнова", 6, 10)],
  },
  {
    id: "e-102",
    name: "Электровелосипед E-102",
    bars: [
      booking("b-2", "ИП Гусев", 1, 5),
      {
        id: "s-1",
        label: "Техобслуживание",
        start: at(7),
        end: at(9),
        color: "orange",
        edit: "none",
      },
    ],
  },
  {
    id: "pcx-160",
    name: "Скутер Honda PCX 160",
    bars: [
      issued("r-3", "Евгений", -2, 3),
      {
        ...booking("b-4", "Waikl", 3, 12),
        description: "Клиент · 300 $ депозит",
        height: "l",
      },
      {
        id: "d-1",
        label: "Документы · регистрация",
        start: at(-1),
        end: at(2),
        color: "purple",
        height: "s",
      },
      {
        id: "s-2",
        label: "Техосмотр",
        start: at(12),
        end: at(14),
        color: "orange",
        height: "s",
      },
    ],
  },
  {
    id: "s-201",
    name: "Самокат S-201",
    bars: [issued("r-2", "Ковалёв", -1, 2), booking("b-3", "ООО «Доставка 24»", 3, 12)],
  },
];

export default function GanttRentalsExample() {
  const [fleet, setFleet] = React.useState(FLEET);

  const changeDates = (dates: GanttDates, bar: GanttBar) =>
    setFleet((vehicles) =>
      vehicles.map((vehicle) => ({
        ...vehicle,
        bars: vehicle.bars.map((other) => (other.id === bar.id ? { ...other, ...dates } : other)),
      })),
    );

  const addBooking = (dates: GanttDates, vehicle: Vehicle) =>
    setFleet((vehicles) =>
      vehicles.map((other) =>
        other.id === vehicle.id
          ? {
              ...other,
              bars: [
                ...other.bars,
                {
                  id: `${other.id}-${other.bars.length + 1}`,
                  label: "Бронь · новая",
                  ...dates,
                  color: "blue",
                },
              ],
            }
          : other,
      ),
    );

  return (
    <Gantt
      aria-label="Календарь парка"
      defaultZoom="day"
      today={TODAY}
      rows={fleet}
      getRowKey={(vehicle) => vehicle.id}
      getRowLabel={(vehicle) => vehicle.name}
      getRowBars={(vehicle) => vehicle.bars}
      onBarChange={changeDates}
      onBarCreate={addBooking}
    />
  );
}
