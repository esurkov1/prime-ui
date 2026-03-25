import { AlertCircle, AlertTriangle, CheckCircle2, Info, Sparkles } from "lucide-react";

import { Banner } from "@/components/banner/Banner";

/** Семантические статусы при одном варианте `light`. */
export default function BannerStatusesSnippet() {
  return (
    <>
      <Banner.Root status="information" variant="light">
        <Banner.Content>
          <Banner.Icon as={Info} aria-hidden />
          <Banner.Title>information</Banner.Title>
          <Banner.Description>Справка и нейтральные новости.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root status="warning" variant="light">
        <Banner.Content>
          <Banner.Icon as={AlertTriangle} aria-hidden />
          <Banner.Title>warning</Banner.Title>
          <Banner.Description>Требуется внимание, без блокировки действий.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root status="error" variant="light">
        <Banner.Content>
          <Banner.Icon as={AlertCircle} aria-hidden />
          <Banner.Title>error</Banner.Title>
          <Banner.Description>Сбой, отказ или нарушение правил.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root status="success" variant="light">
        <Banner.Content>
          <Banner.Icon as={CheckCircle2} aria-hidden />
          <Banner.Title>success</Banner.Title>
          <Banner.Description>Успешное сохранение или завершение шага.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root status="feature" variant="light">
        <Banner.Content>
          <Banner.Icon as={Sparkles} aria-hidden />
          <Banner.Title>feature</Banner.Title>
          <Banner.Description>Новая возможность или промо-блок.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
    </>
  );
}
