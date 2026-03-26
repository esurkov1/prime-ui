import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardCard } from "./DashboardCard";

describe("DashboardCard", () => {
  it("renders mini variant with label and value", () => {
    render(
      <DashboardCard.Root variant="mini" data-testid="card">
        <DashboardCard.IconBox aria-hidden>×</DashboardCard.IconBox>
        <DashboardCard.Stack>
          <DashboardCard.Label>Age</DashboardCard.Label>
          <DashboardCard.Value>36 years</DashboardCard.Value>
        </DashboardCard.Stack>
      </DashboardCard.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-variant", "mini");
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("36 years")).toBeInTheDocument();
  });

  it("renders section variant with title and body", () => {
    render(
      <DashboardCard.Root variant="section" data-testid="section-card">
        <DashboardCard.SectionHeader>
          <DashboardCard.SectionTitle>Revenue</DashboardCard.SectionTitle>
        </DashboardCard.SectionHeader>
        <DashboardCard.Body>Chart</DashboardCard.Body>
      </DashboardCard.Root>,
    );
    expect(screen.getByTestId("section-card")).toHaveAttribute("data-variant", "section");
    expect(screen.getByRole("heading", { name: "Revenue" })).toBeInTheDocument();
    expect(screen.getByText("Chart")).toBeInTheDocument();
  });
});
