# Enforce specific format for TODO/FIXME comments (todo-requires-url-format)

This rule ensures that `TODO` and `FIXME` comments follow a specific format: `TERM(URL): message`. It helps maintain consistency and ensures that action items are linked to a tracking URL (like a bug tracker or issue).

## Rule Details

This rule flags `TODO` or `FIXME` comments (case-insensitive) that do not strictly adhere to the following structure at the beginning of the comment:

1.  The term (`TODO` or `FIXME`).
2.  An opening parenthesis `(`.
3.  A valid URL (matching a standard URL pattern).
4.  A closing parenthesis `)`.
5.  A colon `:`.
6.  Optional whitespace.
7.  The comment message.

Leading whitespace or asterisks (`*`) in block comments before the term are ignored.

**Why?**

* **Consistency:** Keeps all TODO/FIXME comments in a uniform style.
* **Actionability:** Encourages linking comments to actual work items (e.g., JIRA tickets, GitHub issues), making them easier to track and resolve.
* **Clarity:** The structured format makes it clear where the tracking information is located within the comment.

Examples of **incorrect** code for this rule:

```js
// TODO: Fix this bug (Missing URL and required format)

// FIXME Need to refactor this (Missing URL and required format)

// TODO http://example.com/issue/123: Fix this (Missing parentheses)

// FIXME(http://example.com/issue/456) Needs refactor (Missing colon)

// TODO (http://example.com/issue/123): Add tests (Space between term and parenthesis)

// TODO(not-a-url): This won't work (Invalid URL pattern)

/*
 * FIXME: Refactor this module
 * Link: http://example.com/task/789 (URL present but not in the required format)
 */
```

Examples of **correct** code for this rule:

```js
// TODO(http://example.com/issue/123): Fix this tricky bug.

// FIXME(https://jira.example.com/browse/PROJ-456): Refactor this section for performance.

/*
 * TODO(http://example.com/issue/124): Address the feedback from the PR.
 * This requires updating the validation logic.
 */
```

## Options

This rule does not have any configuration options.

## When Not To Use It

* If your project follows a different convention for TODO/FIXME comments.
* If you don't require linking comments to external URLs.
* In very informal projects or personal scripts where strict formatting is not a priority.
