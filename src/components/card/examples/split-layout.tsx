import { Card, Icon } from "prime-ui-kit";

/** Two related metrics in one tile (`IconBox` + `Stack` per cell). */
export function SplitLayoutExample() {
  return (
    <Card.Root variant="split">
      <Card.Split>
        <Card.SplitCell>
          <Card.IconBox aria-hidden>
            <Icon surface="none" name="nav.layoutGrid" aria-hidden />
          </Card.IconBox>
          <Card.Stack>
            <Card.Label>Conversion</Card.Label>
            <Card.Value>3.8%</Card.Value>
          </Card.Stack>
        </Card.SplitCell>
        <Card.SplitCell>
          <Card.IconBox aria-hidden>
            <Icon surface="none" name="field.email" aria-hidden />
          </Card.IconBox>
          <Card.Stack>
            <Card.Label>Average order value</Card.Label>
            <Card.Value>$64</Card.Value>
          </Card.Stack>
        </Card.SplitCell>
      </Card.Split>
    </Card.Root>
  );
}
