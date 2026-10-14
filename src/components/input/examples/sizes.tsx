/** Every size tier; the label and the hint follow the field tier — `size`. */
import { Input } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function InputSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <Input.Root size={size} label={size} hint="Пришлём ссылку для входа">
              <Input.Wrapper>
                <Input.Field type="email" placeholder="name@company.ru" />
              </Input.Wrapper>
            </Input.Root>
          </div>
        </div>
      ))}
    </>
  );
}
