import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card", () => {
  it("renders mini variant with label and value", () => {
    render(
      <Card.Root variant="mini" data-testid="card">
        <Card.IconBox aria-hidden>×</Card.IconBox>
        <Card.Stack>
          <Card.Label>Age</Card.Label>
          <Card.Value>36 years</Card.Value>
        </Card.Stack>
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-variant", "mini");
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("36 years")).toBeInTheDocument();
  });

  it("renders panel variant with title and chart region", () => {
    render(
      <Card.Root variant="panel" data-testid="panel-card">
        <Card.SectionHeader>
          <Card.SectionTitle>Revenue</Card.SectionTitle>
        </Card.SectionHeader>
        <Card.Chart>Chart</Card.Chart>
      </Card.Root>,
    );
    expect(screen.getByTestId("panel-card")).toHaveAttribute("data-variant", "panel");
    expect(screen.getByRole("heading", { name: "Revenue" })).toBeInTheDocument();
    expect(screen.getByText("Chart")).toBeInTheDocument();
  });

  it("renders stat-trend variant with delta trend", () => {
    render(
      <Card.Root variant="stat-trend" data-testid="stat-card">
        <Card.Label>MRR</Card.Label>
        <Card.Value>120k</Card.Value>
        <Card.Delta trend="up">+5%</Card.Delta>
      </Card.Root>,
    );
    expect(screen.getByTestId("stat-card")).toHaveAttribute("data-variant", "stat-trend");
    expect(screen.getByText("+5%")).toHaveAttribute("data-trend", "up");
  });

  it("renders panel variant with padded body and chart", () => {
    render(
      <Card.Root variant="panel" data-testid="panel-card">
        <Card.SectionHeader>
          <Card.SectionTitle>Revenue</Card.SectionTitle>
        </Card.SectionHeader>
        <Card.Body>Intro</Card.Body>
        <Card.Chart>Plot</Card.Chart>
      </Card.Root>,
    );
    expect(screen.getByText("Intro")).toBeInTheDocument();
    expect(screen.getByText("Plot")).toBeInTheDocument();
  });
});
