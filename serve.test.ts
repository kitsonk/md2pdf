import { assertEquals } from "jsr:@std/assert/equals";

import { serve } from "./serve.ts";

Deno.test({
  name: "serve()",
  fn: async () => {
    const md = `# Hello, world!

| Type | Value |
| ---- | ----- |
| x    | 42    |

\`\`\`js
console.log("Hello, world!");
\`\`\`
`;
    const server = await serve(md);
    const res = await fetch(`http://localhost:${server.addr.port}/`);
    const actual = await res.text();
    const expected = await Deno.readTextFile("_fixtures/test.html");
    assertEquals(actual, expected);
    await server.shutdown();
  },
});
