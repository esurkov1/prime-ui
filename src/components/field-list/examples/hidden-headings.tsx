/** The links of a project, where each field names itself by its placeholder: no heading row above the rows, the column names still read to assistive tech — `hideHeadings`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

type Link = { id: string; title: string; url: string };

const COLUMNS: FieldListColumn[] = [{ label: "Название", width: "m" }, { label: "Ссылка" }];

const LINKS: Link[] = [
  { id: "brief", title: "Бриф", url: "https://docs.company.ru/brief" },
  { id: "board", title: "Доска задач", url: "https://tasks.company.ru/crm" },
];

export default function FieldListHiddenHeadingsExample() {
  const [links, setLinks] = React.useState(LINKS);

  return (
    <FieldList
      label="Ссылки проекта"
      columns={COLUMNS}
      hideHeadings
      value={links}
      onValueChange={setLinks}
      getId={(link) => link.id}
      getLabel={(link) => link.title}
      createItem={() => ({ id: crypto.randomUUID(), title: "", url: "" })}
      addLabel="Ссылка"
      renderItem={(link, row) => (
        <>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={link.title}
                placeholder="Название"
                onChange={(event) => row.update({ title: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                type="url"
                value={link.url}
                placeholder="https://"
                onChange={(event) => row.update({ url: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
        </>
      )}
    />
  );
}
