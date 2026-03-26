import { Pagination } from "prime-ui-kit";

/**
 * Canonical wiring: required props on Pagination.Root only. Long ranges use siblingCount to widen the numeric window.
 */
export default function CanonicalCompositionExample() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "flex-start",
      }}
    >
      <Pagination.Root page={2} totalPages={5} onPageChange={() => {}} />
      <Pagination.Root page={10} totalPages={40} onPageChange={() => {}} siblingCount={2} />
    </div>
  );
}
