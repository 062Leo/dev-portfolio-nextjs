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
  // Skills graph and its helpers: large simulation functions (#74).
  {
    files: ["src/components/SkillGraph.tsx", "src/components/pricetags.ts"],
    rules: {
      complexity: "off",
      "max-depth": "off",
      "max-params": "off",
    },
  },
  // Rope animation of the skills graph (#74).
  {
    files: ["src/components/WobblyRopes.tsx"],
    rules: {
      complexity: "off",
    },
  },
  // Inline language ternaries drive the complexity; centralised i18n removes them (#70).
  {
    files: [
      "src/components/Footer.tsx",
      "src/components/projects/default.tsx",
      "src/components/projects/components/Demo.tsx",
    ],
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
  ]),
]);

export default eslintConfig;
