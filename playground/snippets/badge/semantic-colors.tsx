import { Badge } from "@/components/badge/Badge";

/** Все значения color на variant light — для подписей к статусам и тегам. */
export default function BadgeSemanticColorsSnippet() {
  return (
    <div className="row rowGapTight" style={{ flexWrap: "wrap" }}>
      <Badge.Root color="gray" variant="light" size="m">
        gray
      </Badge.Root>
      <Badge.Root color="red" variant="light" size="m">
        red
      </Badge.Root>
      <Badge.Root color="blue" variant="light" size="m">
        blue
      </Badge.Root>
      <Badge.Root color="green" variant="light" size="m">
        green
      </Badge.Root>
      <Badge.Root color="orange" variant="light" size="m">
        orange
      </Badge.Root>
      <Badge.Root color="yellow" variant="light" size="m">
        yellow
      </Badge.Root>
      <Badge.Root color="purple" variant="light" size="m">
        purple
      </Badge.Root>
      <Badge.Root color="sky" variant="light" size="m">
        sky
      </Badge.Root>
      <Badge.Root color="pink" variant="light" size="m">
        pink
      </Badge.Root>
      <Badge.Root color="teal" variant="light" size="m">
        teal
      </Badge.Root>
    </div>
  );
}
