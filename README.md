# @kitsonk/md2pdf

A markdown to PDF library.

## Usage

Use the `generate()` function to convert markdown to a PDF encoded as a
`Uint8Array`.

```ts
import { generate } from "@kitsonk/md2pdf";

const md = `# Hello, world!

| Type | Value |
| ---- | ----- |
| x    | 42    |
| y    | 43    |
| z    | 44    |

\`\`\`js
console.log("Hello, world!");
\`\`\`
`;

const pdf = await generate(md);
Deno.writeFile("output.pdf", pdf);
```

---

Copyright 2025 Kitson P. Kelly. All rights reserved. MIT License.
