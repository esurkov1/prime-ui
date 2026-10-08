import { ChevronDown } from "lucide-react";
import { api } from "@/components/native-select/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "native-select",
    label: "Native Select",
    summary: "Системный список выбора в виде поля",
    keywords: ["native", "select", "option", "системный", "мобильный", "селект"],
    icon: ChevronDown,
    order: 7,
  },
  dir: "native-select",
  title: "NativeSelect",
  kind: "field",
  description:
    "Системный `<select>` в виде поля кита: на телефоне открывается список операционной системы. Пункты — обычные `<option>`; свой список с поиском и богатыми пунктами — Select.",
  examples: [
    {
      slot: "overview",
      description:
        "Поле с подписью и подсказкой; на телефоне откроется системный список — `label`, `hint`.",
    },
    { slot: "sizes", description: "Все ярусы; подпись и подсказка берут ярус поля — `size`." },
    {
      slot: "states",
      description: "Обычное поле рядом с неактивным и ошибочным — `disabled`, `invalid`.",
    },
    {
      slot: "validation",
      description:
        "Пометки обязательного и необязательного поля, подсказка и ошибка вместо неё в той же строке — `required`, `optional`, `hint`, `error`.",
    },
    {
      scenario: "option-groups",
      title: "Группы пунктов",
      description:
        "Пункты под заголовками групп через нативный optgroup и плейсхолдер, пока ничего не выбрано — `placeholder`.",
    },
    {
      slot: "controlled",
      description:
        "Значением владеет родитель: тариф меняет цену под полем — `value`, `onValueChange`.",
    },
    {
      slot: "in-form",
      description:
        "Форма доставки для телефона: значение попадает в FormData, обязательный город проверяется при отправке — `name`, `required`, `error`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space · ArrowDown",
        action: "Открывают системный список (поведение браузера и ОС).",
      },
      {
        keys: "ArrowUp · ArrowDown",
        action: "На закрытом поле меняют значение (в большинстве браузеров).",
      },
    ],
    aria: [
      "Это настоящий `<select>`: роль, клавиатура и список — от браузера и ОС.",
      "`label` — `<label htmlFor>`; подсказка и ошибка связаны через `aria-describedby`, ошибка ставит `aria-invalid`.",
      "Шеврон декоративен (`aria-hidden`).",
    ],
  },
};
