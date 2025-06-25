import { render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";

// Custom render function that includes common providers/context if needed
function render(ui: ReactElement) {
  return rtlRender(ui);
}

// Re-export everything
export * from "@testing-library/react";
export { render };
