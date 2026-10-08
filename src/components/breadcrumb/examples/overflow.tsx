/** A long path: levels truncate, and in a 320px container the middle ones collapse into «…», which screen readers announce as hidden levels. */
import { Breadcrumb } from "prime-ui-kit";

import styles from "./examples.module.css";

const LEVELS = ["Каталог", "Мебель", "Офисные кресла"];
const CURRENT = "Эргономичное кресло с подголовником и поддержкой поясницы";

export default function BreadcrumbOverflowExample() {
  return (
    <>
      {[styles.wide, styles.narrow].map((width) => (
        <div key={width} className={width}>
          <Breadcrumb.Root>
            {LEVELS.map((level) => (
              <Breadcrumb.Item key={level} href={`#${level}`}>
                {level}
              </Breadcrumb.Item>
            ))}
            <Breadcrumb.Item current>{CURRENT}</Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>
      ))}
    </>
  );
}
