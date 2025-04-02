import { generate } from "./mod.ts";

import { readPdfText } from "npm:pdf-text-reader";
import { assertEquals } from "jsr:@std/assert/equals";

Deno.test({
  name: "generate()",
  fn: async () => {
    const md = `# Hello, world!

| Type | Value |
| ---- | ----- |
| x    | 42    |

\`\`\`js
console.log("Hello, world!");
\`\`\`
`;
    const actual = await generate(md);
    assertEquals(
      await readPdfText({ data: actual }),
      `Hello, world!
Type Value

x 42

console.log("Hello, world!");`,
    );
  },
});
