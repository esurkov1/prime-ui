import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card", () => {
  it("renders mini variant with an icon, label and value straight in the root", () => {
    render(
      <Card.Root variant="mini" data-testid="card">
        <Card.Icon aria-hidden>×</Card.Icon>
        <Card.Label>Age</Card.Label>
        <Card.Value>36 years</Card.Value>
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-variant", "mini");
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("36 years")).toBeInTheDocument();
  });

  it("renders panel variant with a header, body, media and footer", () => {
    render(
      <Card.Root data-testid="panel-card">
        <Card.Header>
          <Card.Title>Revenue</Card.Title>
          <button type="button">Period</button>
        </Card.Header>
        <Card.Body>Intro</Card.Body>
        <Card.Media>Plot</Card.Media>
        <Card.Footer>
          <button type="button">Save</button>
        </Card.Footer>
      </Card.Root>,
    );
    expect(screen.getByTestId("panel-card")).toHaveAttribute("data-variant", "panel");
    expect(screen.getByRole("heading", { name: "Revenue" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Period" })).toBeInTheDocument();
    expect(screen.getByText("Intro")).toBeInTheDocument();
    expect(screen.getByText("Plot")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders stat-trend variant with delta trend", () => {
    render(
      <Card.Root variant="stat-trend" data-testid="stat-card">
        <Card.Label>MRR</Card.Label>
        <Card.Value>120k</Card.Value>
        <Card.Delta tone="success">+5%</Card.Delta>
      </Card.Root>,
    );
    expect(screen.getByTestId("stat-card")).toHaveAttribute("data-variant", "stat-trend");
    expect(screen.getByText("+5%")).toHaveAttribute("data-tone", "success");
  });

  it("renders the list template as a list of items", () => {
    render(
      <Card.Root variant="list">
        <Card.Header>
          <Card.Title>Events</Card.Title>
        </Card.Header>
        <Card.List>
          <Card.ListItem>One</Card.ListItem>
          <Card.ListItem>Two</Card.ListItem>
        </Card.List>
      </Card.Root>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("titles render h3 by default and take a heading level via as", () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title as="h2">Профиль</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Title>Тариф</Card.Title>
        </Card.Body>
      </Card.Root>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Профиль" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Тариф" })).toBeInTheDocument();
  });
});
