import { FileText, Search, Settings, Sparkles, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

import cmdStyles from "@/components/command-menu/CommandMenu.module.css";
import { Kbd } from "@/components/kbd/Kbd";
import { Tag } from "@/components/tag/Tag";
import { Typography } from "@/components/typography/Typography";

import demoStyles from "./command-menu-demos.module.css";

export default function CommandMenuCompositionSnippet() {
  const [open, setOpen] = React.useState(false);
  const [scopes, setScopes] = React.useState(["Документы", "Команды"]);

  return (
    <>
      <Button.Root size="m" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Полная композиция
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} aria-labelledby="cmd-title">
        <div className={demoStyles.dialogHeaderPad}>
          <Typography.Root
            as="div"
            id="cmd-title"
            role="heading"
            aria-level={2}
            variant="body-large"
            weight="semibold"
          >
            Палитра
          </Typography.Root>
          <Typography.Root
            variant="body-small"
            tone="muted"
            className={demoStyles.dialogHeaderLead}
          >
            Поиск по разделам и быстрые действия
          </Typography.Root>
        </div>

        <CommandMenu.InputRow
          leading={<Search className={cmdStyles.inputIcon} strokeWidth={2} aria-hidden />}
          trailing={
            <>
              <Kbd.Root aria-label="Сочетание открытия">⌘K</Kbd.Root>
              <Button.Root
                size="m"
                variant="neutral"
                mode="ghost"
                aria-label="Закрыть"
                onClick={() => setOpen(false)}
              >
                <Button.Icon>
                  <X size={18} strokeWidth={2} aria-hidden />
                </Button.Icon>
              </Button.Root>
            </>
          }
        >
          <CommandMenu.Input placeholder="Куда перейти…" aria-label="Поиск" />
        </CommandMenu.InputRow>

        <CommandMenu.TagSection>
          <CommandMenu.TagSectionLabel>
            <Typography.Root variant="body-compact" tone="muted">
              Область поиска
            </Typography.Root>
          </CommandMenu.TagSectionLabel>
          <CommandMenu.TagRow>
            {scopes.map((s) => (
              <Tag.Root
                key={s}
                size="m"
                onRemove={() => setScopes((p) => p.filter((x) => x !== s))}
              >
                {s}
              </Tag.Root>
            ))}
          </CommandMenu.TagRow>
        </CommandMenu.TagSection>

        <CommandMenu.List>
          <CommandMenu.Group heading="Файл">
            <CommandMenu.Item value="новый документ" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as={FileText} strokeWidth={2} />
              Новый документ
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="Система">
            <CommandMenu.Item
              value="настройки"
              keywords="preferences profile"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={Settings} strokeWidth={2} />
              Настройки
            </CommandMenu.Item>
            <CommandMenu.Item
              value="подсказки"
              keywords="help tips"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={Sparkles} strokeWidth={2} />
              Подсказки
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>

        <CommandMenu.Footer className={cmdStyles.footerMuted}>
          <Typography.Root variant="body-compact" tone="muted">
            Стрелки и Enter — из поля поиска; группы скрываются, если в них нет видимых пунктов.
          </Typography.Root>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>
    </>
  );
}
