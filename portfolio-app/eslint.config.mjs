import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      eqeqeq: ["error", "always"],
      "no-empty": ["error", { allowEmptyCatch: false }],
      "max-depth": ["error", 4],
      "max-params": ["error", 4],
      complexity: ["error", 15],
    },
  },
  // Structural violations left in place until the named follow-up issues restructure the code.
  // Project detail page: one component renders every optional section (stats, screenshots,
  // demo, download, code and custom links) plus three inline dialogs; complexity 30. The
  // detail page rework splits it (#85).
  {
    files: ["src/components/projects/default.tsx"],
    rules: {
      complexity: "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Playwright output.
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
