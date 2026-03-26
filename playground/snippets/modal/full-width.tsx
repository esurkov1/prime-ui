import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Typography } from "@/components/typography/Typography";
import { Icon } from "@/icons";

/** Кнопки в подвале с `fullWidth`: колонка действий на всю ширину панели (типично для узкой ширины). */
export default function ModalFullWidthSnippet() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Оформить заказ
        </Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        description={
          <>
            В подвале — вертикальный стек: у <code>Button.Root</code> задан <code>fullWidth</code>,
            панель задаёт ширину колонки.
          </>
        }
        footer={
          <div className="previewBannerColumn">
            <Modal.Close>
              <Button.Root size="m" variant="primary" fullWidth>
                Перейти к оплате
              </Button.Root>
            </Modal.Close>
            <Modal.Close>
              <Button.Root size="m" variant="neutral" mode="stroke" fullWidth>
                В корзину
              </Button.Root>
            </Modal.Close>
          </div>
        }
        icon={<Icon name="action.upload" />}
        title="Подтверждение"
      >
        <Typography.Root as="p" variant="body-default">
          Проверьте состав корзины перед оплатой.
        </Typography.Root>
      </Modal.Panel>
    </Modal.Root>
  );
}
