/** Every state, each in its own group and labelled by its prop — `value`, `invalid`, `disabled`. */
import { Radio } from "prime-ui-kit";

export default function RadioStatesExample() {
  return (
    <>
      <div>
        <div>
          <Radio.Group aria-label="unchecked">
            <Radio.Root value="unchecked">
              <Radio.Label>unchecked</Radio.Label>
            </Radio.Root>
          </Radio.Group>
        </div>
        <div>
          <Radio.Group defaultValue="checked" aria-label="checked">
            <Radio.Root value="checked">
              <Radio.Label>checked</Radio.Label>
            </Radio.Root>
          </Radio.Group>
        </div>
        <div>
          <Radio.Group invalid aria-label="invalid">
            <Radio.Root value="invalid">
              <Radio.Label>invalid</Radio.Label>
            </Radio.Root>
          </Radio.Group>
        </div>
      </div>
      <div>
        <div>
          <Radio.Group disabled aria-label="disabled">
            <Radio.Root value="disabled">
              <Radio.Label>disabled</Radio.Label>
            </Radio.Root>
          </Radio.Group>
        </div>
        <div>
          <Radio.Group disabled defaultValue="checked" aria-label="disabled · checked">
            <Radio.Root value="checked">
              <Radio.Label>disabled · checked</Radio.Label>
            </Radio.Root>
          </Radio.Group>
        </div>
      </div>
    </>
  );
}
