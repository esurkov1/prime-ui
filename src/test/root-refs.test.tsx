import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { SmartFilter } from "@/components/smart-filter/SmartFilter";
import { Stepper } from "@/components/stepper/Stepper";
import { Tabs } from "@/components/tabs/Tabs";

// Every Root that renders DOM takes a ref to its outermost element (CLAUDE.md §1).
describe("Root refs", () => {
  it("Tabs.Root → div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Tabs.Root ref={ref} defaultValue="a">
        <Tabs.List>
          <Tabs.Item value="a">Заказы</Tabs.Item>
        </Tabs.List>
      </Tabs.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("SegmentedControl.Root → radiogroup div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <SegmentedControl.Root ref={ref} defaultValue="a" aria-label="Период">
        <SegmentedControl.Item value="a">День</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(ref.current).toHaveAttribute("role", "radiogroup");
  });

  it("Stepper.Root → ol", () => {
    const ref = React.createRef<HTMLOListElement>();
    render(
      <Stepper.Root ref={ref}>
        <Stepper.Item>
          <Stepper.Content>
            <Stepper.Title>Данные</Stepper.Title>
          </Stepper.Content>
        </Stepper.Item>
      </Stepper.Root>,
    );
    expect(ref.current?.tagName).toBe("OL");
  });

  it("Breadcrumb.Root → nav", () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <Breadcrumb.Root ref={ref}>
        <Breadcrumb.Item current>Заказы</Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("SmartFilter.Root → div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <SmartFilter.Root ref={ref} fields={[]}>
        <SmartFilter.Toolbar />
      </SmartFilter.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
