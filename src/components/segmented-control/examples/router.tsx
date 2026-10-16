/** Router links as the segments: the current route is the value, each segment is a link and the row is a navigation; render it inside a router — `asChild`, `value`. */
import { SegmentedControl } from "prime-ui-kit";
import { Link, useLocation } from "react-router-dom";

const SECTIONS = [
  { to: "/", label: "Сотрудники" },
  { to: "/roles", label: "Роли" },
  { to: "/invites", label: "Приглашения" },
];

export default function SegmentedControlRouterExample() {
  const location = useLocation();
  return (
    <SegmentedControl.Root value={location.pathname} aria-label="Команда и роли">
      {SECTIONS.map((section) => (
        <SegmentedControl.Item key={section.to} value={section.to} asChild>
          <Link to={section.to}>{section.label}</Link>
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
}
