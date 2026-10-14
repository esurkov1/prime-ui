import { nodeText } from "./nodeText";

describe("nodeText", () => {
  it("joins the text of a node tree", () => {
    expect(
      nodeText(
        <span>
          Счёт <b>№ {42}</b>
        </span>,
      ),
    ).toBe("Счёт № 42");
    expect(nodeText(["Заказ ", <em key="n">7</em>])).toBe("Заказ 7");
  });

  it("adds nothing for empty and boolean nodes", () => {
    expect(nodeText(null)).toBe("");
    expect(nodeText(undefined)).toBe("");
    expect(nodeText(false)).toBe("");
    expect(nodeText(<span>{true}</span>)).toBe("");
  });
});
