import { Bike } from "lucide-react";
import { createIcon } from "prime-ui-kit";

// Доменная иконка, которой нет в наборе: один раз на уровне модуля.
const BikeIcon = createIcon(Bike);

export const bike = <BikeIcon size="l" />;
