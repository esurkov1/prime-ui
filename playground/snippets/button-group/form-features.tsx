import { ButtonGroup } from "@/components/button-group/ButtonGroup";

/** Нативные `type="submit"` и `type="reset"` на сегментах внутри одной формы. */
export default function ButtonGroupFormFeaturesSnippet() {
  return (
    <form
      className="flex max-w-sm flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label className="text-sm opacity-80" htmlFor="demo-bg-query">
        Запрос
      </label>
      <input
        className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600"
        defaultValue=""
        id="demo-bg-query"
        name="q"
        type="search"
      />
      <ButtonGroup.Root aria-label="Отправить или сбросить поиск" size="m">
        <ButtonGroup.Item type="submit">Найти</ButtonGroup.Item>
        <ButtonGroup.Item type="reset">Сбросить</ButtonGroup.Item>
      </ButtonGroup.Root>
    </form>
  );
}
