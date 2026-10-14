import { swallowNextClick } from "./swallowNextClick";

function setup() {
  const source = document.createElement("div");
  const scope = document.createElement("div");
  const outside = document.createElement("button");
  const inScope = document.createElement("button");
  scope.append(inScope);
  document.body.append(source, scope, outside);
  return { source, scope, outside, inScope };
}

describe("swallowNextClick", () => {
  afterEach(() => document.body.replaceChildren());

  it("takes the next click inside the source, once", () => {
    const { source } = setup();
    const onClick = vi.fn();
    source.addEventListener("click", onClick);
    swallowNextClick(source);
    source.click();
    expect(onClick).not.toHaveBeenCalled();
    source.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("takes a click inside the scope (an element rendered anew where the item landed)", () => {
    const { source, scope, inScope } = setup();
    const onClick = vi.fn();
    inScope.addEventListener("click", onClick);
    swallowNextClick(source, scope);
    inScope.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("lets a click elsewhere through and stops watching", () => {
    const { source, outside } = setup();
    const onSource = vi.fn();
    const onOutside = vi.fn();
    source.addEventListener("click", onSource);
    outside.addEventListener("click", onOutside);
    swallowNextClick(source);
    outside.click();
    expect(onOutside).toHaveBeenCalledTimes(1);
    source.click();
    expect(onSource).toHaveBeenCalledTimes(1);
  });

  it("stops at the next press or key, and when stopped early", () => {
    const { source } = setup();
    const onClick = vi.fn();
    source.addEventListener("click", onClick);
    swallowNextClick(source);
    window.dispatchEvent(new Event("pointerdown"));
    source.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    swallowNextClick(source);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    source.click();
    expect(onClick).toHaveBeenCalledTimes(2);
    const stop = swallowNextClick(source);
    stop();
    source.click();
    expect(onClick).toHaveBeenCalledTimes(3);
  });
});
