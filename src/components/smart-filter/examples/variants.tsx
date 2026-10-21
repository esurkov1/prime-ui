/** Four shapes of one toolbar: the filter button alone, the search alone, the search beside the button, one field with a filter section — `searchable`, `fields`, `layout`. */
import { SmartFilter, type SmartFilterField, Typography } from "prime-ui-kit";

const FIELDS: SmartFilterField[] = [
  {
    key: "status",
    label: "Статус",
    options: [
      { value: "new", label: "Новые" },
      { value: "paid", label: "Оплаченные" },
      { value: "shipped", label: "Отгруженные" },
    ],
  },
  {
    key: "manager",
    label: "Менеджер",
    finite: false,
    options: ["Анна Белова", "Илья Орлов", "Мария Ким"].map((v) => ({ value: v, label: v })),
  },
];

const PAID = { status: { include: ["paid"], exclude: [] } };

export default function SmartFilterVariantsExample() {
  return (
    <>
      <div>
        <div>
          <SmartFilter.Root fields={FIELDS} defaultValue={PAID}>
            <SmartFilter.Toolbar searchable={false} />
          </SmartFilter.Root>
          <Typography as="span" variant="caption" tone="muted">
            {"searchable={false}"}
          </Typography>
        </div>
      </div>
      <div>
        <div>
          <SmartFilter.Root fields={[]}>
            <SmartFilter.Toolbar />
          </SmartFilter.Root>
          <Typography as="span" variant="caption" tone="muted">
            {"fields={[]}"}
          </Typography>
        </div>
      </div>
      <div>
        <div>
          <SmartFilter.Root fields={FIELDS} defaultValue={PAID}>
            <SmartFilter.Toolbar layout="split" />
          </SmartFilter.Root>
          <Typography as="span" variant="caption" tone="muted">
            split
          </Typography>
        </div>
      </div>
      <div>
        <div>
          <SmartFilter.Root fields={FIELDS} defaultValue={PAID}>
            <SmartFilter.Toolbar layout="combined" />
          </SmartFilter.Root>
          <Typography as="span" variant="caption" tone="muted">
            combined
          </Typography>
        </div>
      </div>
    </>
  );
}
