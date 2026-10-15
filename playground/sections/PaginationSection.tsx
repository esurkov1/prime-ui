import { api } from "@/components/pagination/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { ChevronsLeftRight } from "../icons";

export const page: ComponentPageConfig = {
  category: "navigation",
  nav: {
    segment: "pagination",
    label: "Pagination",
    summary: "Постраничная навигация",
    keywords: ["пагинация", "страницы", "value", "onValueChange"],
    icon: ChevronsLeftRight,
    order: 3,
  },
  dir: "pagination",
  title: "Pagination",
  kind: "navigation",
  description:
    "Постраничная навигация по списку: стрелки, номера с многоточием и компактный вид «3 / 12» для узких мест.",
  examples: [
    {
      slot: "overview",
      description:
        "Страницы списка заказов: стрелки, номера и текущая страница — `totalPages`, `defaultValue`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы; кнопки по высоте как Button и Input того же яруса, от 28 до 48 px — `size`.",
    },
    {
      slot: "overflow",
      description:
        "До 7 страниц без многоточия, дальше — окно вокруг текущей; окно шире — `siblingCount`.",
    },
    {
      slot: "controlled",
      description:
        "Подвал списка владеет страницей: смена числа строк возвращает на первую, номера в конце рядом с диапазоном — `value`, `onValueChange`, `align`.",
    },
    {
      slot: "narrow",
      description:
        "Подвал карточки 320 px: по умолчанию номера на узкой ширине уступают «текущая / всего», `compact` показывает так всегда — `compact`.",
    },
  ],
  api,
};
