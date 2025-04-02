/**
 * @module
 */

import { CSS, render, type RenderOptions } from "@deno/gfm";

import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-c.js";
import "prismjs/components/prism-csharp.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-csv.js";
import "prismjs/components/prism-diff.js";
import "prismjs/components/prism-docker.js";
import "prismjs/components/prism-graphql.js";
import "prismjs/components/prism-go.js";
import "prismjs/components/prism-java.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-markdown.js";
import "prismjs/components/prism-markup.js";
import "prismjs/components/prism-mermaid.js";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-rust.js";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-toml.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-yaml.js";
import "prismjs/components/prism-zig.js";

export interface ServeOptions extends RenderOptions {
  /**
   * The title of the rendered document.
   *
   * @default ""
   */
  title?: string;
  /**
   * The size of the page. See the
   * [`size`](https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size) CSS
   * attribute for more information.
   *
   * @default "A4"
   */
  pageSize?: string;
  /**
   * Additional CSS to be included in the rendered document.
   */
  additionalCss?: string;
}

/**
 * Serve a markdown file as an HTTP server.
 *
 * Any request to the server will return the rendered markdown as HTML.
 *
 * @example Serving basic markdown:
 *
 * ```ts
 * import { serve } from "@kitsonk/md2pdf/serve";
 *
 * const server = await serve("# Hello, world!");
 * const res = await fetch(`http://localhost:${server.addr.port}/`);
 * const html = await res.text();
 * console.log(html);
 * await server.shutdown();
 * ```
 */
export async function serve(
  md: string,
  options: ServeOptions = {},
): Promise<Deno.HttpServer<Deno.NetAddr>> {
  const {
    title = "",
    pageSize = "A4",
    additionalCss,
    ...renderOptions
  } = options;
  const { promise, resolve } = Promise.withResolvers<void>();
  const server = Deno.serve({
    onListen() {
      resolve();
    },
    handler(_req) {
      const body = render(md, renderOptions);
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page {
      size: ${pageSize};
    }
    main {
      max-width: 800px;
      margin: 0 auto;
    }
    ${CSS}
    ${additionalCss ?? ""}
  </style>
  <title>${title}</title>
</head>
<body>
  <main class="markdown-body">
    ${body}
  </main>
</body>
</html>`,
        {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-store",
          },
        },
      );
    },
  });
  await promise;
  return server;
}
