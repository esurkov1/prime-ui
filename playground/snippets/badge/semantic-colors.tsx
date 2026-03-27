import { Badge } from "@/components/badge/Badge";

/** Все значения color на variant light — для подписей к статусам и тегам. */
export default function BadgeSemanticColorsSnippet() {
  return (
    <div className="row rowGapTight">
      <Badge.Root color="gray" variant="light">
        gray
      </Badge.Root>
      <Badge.Root color="red" variant="light">
        red
      </Badge.Root>
      <Badge.Root color="blue" variant="light">
        blue
      </Badge.Root>
      <Badge.Root color="green" variant="light">
        green
      </Badge.Root>
      <Badge.Root color="orange" variant="light">
        orange
      </Badge.Root>
      <Badge.Root color="yellow" variant="light">
        yellow
      </Badge.Root>
      <Badge.Root color="purple" variant="light">
        purple
      </Badge.Root>
      <Badge.Root color="sky" variant="light">
        sky
      </Badge.Root>
      <Badge.Root color="pink" variant="light">
        pink
      </Badge.Root>
      <Badge.Root color="teal" variant="light">
        teal
      </Badge.Root>
    </div>
  );
}
