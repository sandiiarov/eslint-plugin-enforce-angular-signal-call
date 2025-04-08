import { RuleTester } from "@typescript-eslint/rule-tester";
import { todoRequiresUrlRule } from "./enforce-angular-signal-call";
import * as vitest from "vitest";
import path from "node:path";
import tseslint from "typescript-eslint";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
        defaultProject: "tsconfig.json",
      },
      tsconfigRootDir: path.join(__dirname, "../.."),
    },
  },
});

ruleTester.run("enforce-angular-signal-call", todoRequiresUrlRule, {
  valid: [
    {
      name: "todo inline comment",
      code: `
        // TODO(http://jira.com/JIRA-123): Fix this issue.
      `,
    },
    {
      name: "todo block comment",
      code: `
        /*
         * TODO(http://jira.com/JIRA-123): Fix this issue.
         */
      `,
    },
    {
      name: "fixme inline comment",
      code: `
        // FIXME(http://jira.com/JIRA-123): Fix this issue.
      `,
    },
    {
      name: "fixme block comment",
      code: `
        /*
         * FIXME(http://jira.com/JIRA-123): Fix this issue.
         */
      `,
    },
  ],
  invalid: [
    {
      name: "todo without URL",
      code: `
        // TODO: Fix this issue.
      `,
      errors: [{ messageId: "invalidFormat" }],
    },
    {
      name: "todo with invalid URL",
      code: `
        // TODO(JIRA-123): Fix this issue.
      `,
      errors: [{ messageId: "invalidFormat" }],
    },
    {
      name: "fixme without URL",
      code: `
        // FIXME: Fix this issue.
      `,
      errors: [{ messageId: "invalidFormat" }],
    },
    {
      name: "fixme with invalid URL",
      code: `
        // FIXME(JIRA-123): Fix this issue.
      `,
      errors: [{ messageId: "invalidFormat" }],
    },
  ],
});
