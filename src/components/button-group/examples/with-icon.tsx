/** An icon before the label and square icon-only segments — `ButtonGroup.Icon`, `aria-label`. */
import { ButtonGroup, Icon, Typography } from "prime-ui-kit";

export default function ButtonGroupWithIconExample() {
  return (
    <div>
      <div>
        <ButtonGroup.Root aria-label="Файл">
          <ButtonGroup.Item>
            <ButtonGroup.Icon>
              <Icon name="action.download" />
            </ButtonGroup.Icon>
            Скачать
          </ButtonGroup.Item>
          <ButtonGroup.Item>
            <ButtonGroup.Icon>
              <Icon name="action.copy" />
            </ButtonGroup.Icon>
            Копировать
          </ButtonGroup.Item>
        </ButtonGroup.Root>
        <Typography as="span" variant="caption" tone="muted">
          leading
        </Typography>
      </div>
      <div>
        <ButtonGroup.Root aria-label="Режим просмотра">
          <ButtonGroup.Item aria-label="Код" pressed>
            <ButtonGroup.Icon>
              <Icon name="view.code" />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item aria-label="Превью" pressed={false}>
            <ButtonGroup.Icon>
              <Icon name="view.preview" />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
        </ButtonGroup.Root>
        <Typography as="span" variant="caption" tone="muted">
          icon-only
        </Typography>
      </div>
    </div>
  );
}
