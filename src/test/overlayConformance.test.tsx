/**
 * The overlay conformance suite run on the layer-stack overlays of the kit: it proves the suite
 * itself, and each overlay that passes it is held to it. An overlay's own test file may call
 * `describeOverlayConformance` too, with its own scenario.
 */
import {
  Button,
  ConfirmDialog,
  Drawer,
  Dropdown,
  Input,
  Modal,
  Popover,
  Sheet,
} from "@/components";

import { describeOverlayConformance } from "./overlayConformance";

const FIELD = (
  <Input.Root label="Название">
    <Input.Wrapper>
      <Input.Field />
    </Input.Wrapper>
  </Input.Root>
);

describeOverlayConformance("Modal", {
  render: () => (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root>Открыть</Button.Root>
      </Modal.Trigger>
      <Modal.Content aria-label="Новый проект">
        <Modal.Body>{FIELD}</Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button.Root variant="soft" tone="neutral">
              Отмена
            </Button.Root>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  ),
  trigger: "Открыть",
  role: "dialog",
  modal: true,
});

describeOverlayConformance("Drawer", {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root>Открыть</Button.Root>
      </Drawer.Trigger>
      <Drawer.Content aria-label="Карточка заказа">
        <Drawer.Body>{FIELD}</Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  ),
  trigger: "Открыть",
  role: "dialog",
  modal: true,
});

describeOverlayConformance("Sheet", {
  render: () => (
    <Sheet.Root>
      <Sheet.Trigger>
        <Button.Root>Открыть</Button.Root>
      </Sheet.Trigger>
      <Sheet.Content aria-label="Фильтры">
        <Sheet.Body>{FIELD}</Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  ),
  trigger: "Открыть",
  role: "dialog",
  modal: true,
});

describeOverlayConformance("ConfirmDialog", {
  render: () => (
    <ConfirmDialog.Root
      title="Удалить проект?"
      description="Проект и его задачи удалятся."
      confirmLabel="Удалить"
      onConfirm={() => {}}
    >
      <ConfirmDialog.Trigger>
        <Button.Root>Открыть</Button.Root>
      </ConfirmDialog.Trigger>
    </ConfirmDialog.Root>
  ),
  trigger: "Открыть",
  role: "alertdialog",
  modal: true,
});

describeOverlayConformance("Popover", {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <Button.Root>Открыть</Button.Root>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Фильтры отчёта</Popover.Title>
        {FIELD}
      </Popover.Content>
    </Popover.Root>
  ),
  trigger: "Открыть",
  role: "dialog",
});

describeOverlayConformance("Dropdown", {
  render: () => (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root>Открыть</Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Переименовать</Dropdown.Item>
        <Dropdown.Item>Архивировать</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  ),
  trigger: "Открыть",
  role: "menu",
});
