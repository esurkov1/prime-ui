import { Input } from "@/components/input/Input";

export default function InputFullWidthSnippet() {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--prime-sys-spacing-x4)",
        width: "100%",
        maxWidth: 560,
      }}
    >
      <div style={{ maxWidth: 220 }}>
        <p style={{ margin: "0 0 var(--prime-sys-spacing-x2)", fontSize: 13, opacity: 0.8 }}>
          Узкая колонка: корень поля тянется на ширину родителя.
        </p>
        <Input.Root size="m" hint="Родитель max-width: 220px">
          <Input.Wrapper>
            <Input.Field placeholder="Короткая колонка" />
          </Input.Wrapper>
        </Input.Root>
      </div>
      <div style={{ width: "100%" }}>
        <p style={{ margin: "0 0 var(--prime-sys-spacing-x2)", fontSize: 13, opacity: 0.8 }}>
          На всю ширину карточки: тот же Input.Root в растянутом контейнере.
        </p>
        <Input.Root size="m" hint="Родитель на 100% ширины превью">
          <Input.Wrapper>
            <Input.Field placeholder="Поле на всю ширину блока" />
          </Input.Wrapper>
        </Input.Root>
      </div>
    </div>
  );
}
