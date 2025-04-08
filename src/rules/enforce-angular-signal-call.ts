import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

const URL_REGEX =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/i;

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/your-repo/eslint-plugin-your-plugin/blob/main/docs/rules/${name}.md`
);

export const todoRequiresUrlRule = createRule({
  name: "todo-requires-url",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require TODO/FIXME comments to follow the format TERM(URL): message.",
    },
    messages: {
      invalidFormat:
        "{{ term }} comment must follow the format {{ term }}(URL): message. Example: {{ term }}(http://jira.com/JIRA-123): Fix this issue.",
    },
    schema: [],
    fixable: undefined,
  },
  defaultOptions: [],

  create(context) {
    const terms = ["TODO", "FIXME"];
    const sourceCode = context.sourceCode;
    const comments = sourceCode.getAllComments();

    const termStartPatterns: Record<string, RegExp> = {};
    const requiredFormatPatterns: Record<string, RegExp> = {};

    terms.forEach((term) => {
      const escapedTerm = escapeRegExp(term);

      termStartPatterns[term] = new RegExp(
        `^\\s*\\**\\s*\\b${escapedTerm}\\b`,
        "i"
      );

      // ^ : Start of the string
      // \s*\**\s* : Optional leading whitespace/asterisks
      // \b${escapedTerm}\b : The term itself (whole word, case-insensitive)
      // \( : Literal opening parenthesis
      // ${URL_REGEX.source} : The URL pattern
      // \) : Literal closing parenthesis
      // : : Literal colon
      // \s* : Optional whitespace after the colon (before the message)
      // .* : Any characters for the message (including empty)
      requiredFormatPatterns[term] = new RegExp(
        `^\\s*\\**\\s*\\b${escapedTerm}\\b\\(${URL_REGEX.source}\\):\\s*.*`,
        "i"
      );
    });

    function validate(comment: TSESTree.Comment) {
      const value = comment.value;

      const startingTerm = terms.find((term) => {
        const startPattern = termStartPatterns[term];
        return startPattern && startPattern.test(value);
      });

      if (startingTerm) {
        const requiredFormatPattern = requiredFormatPatterns[startingTerm];
        if (!requiredFormatPattern || !requiredFormatPattern.test(value)) {
          context.report({
            loc: comment.loc,
            messageId: "invalidFormat",
            data: {
              term: startingTerm,
            },
          });
        }
      }
    }

    comments.forEach(validate);

    return {};
  },
});
