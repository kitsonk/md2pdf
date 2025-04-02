/**
 * A library for generating PDFs from markdown.
 *
 * The {@linkcode generate} function takes a markdown string and generates a PDF
 * from it.
 *
 * The library uses `@deno/gfm` to parse the markdown and convert it to HTML and
 * then serves that HTML. The library then uses `@astral/astral` to launch a
 * headless browser and generate a PDF from the served HTML.
 *
 * @example Basic usage:
 *
 * ```ts
 * import { generate } from "@kitsonk/md2pdf";
 *
 * const md = `# Hello, world!
 *
 * | Type | Value |
 * | ---- | ----- |
 * | x    | 42    |
 * | y    | 43    |
 * | z    | 44    |
 *
 * \`\`\`js
 * console.log("Hello, world!");
 * \`\`\`
 * `;
 *
 * const pdf = await generate(md);
 * Deno.writeFile("output.pdf", pdf);
 * ```
 *
 * @module
 */

import { launch, type PdfOptions } from "@astral/astral";

import { serve, type ServeOptions } from "./serve.ts";

/**
 * Options for the {@linkcode generate} function.
 */
export type GenerateOptions = ServeOptions & PdfOptions;

/**
 * Resolves with a PDF in the format of {@linkcode Uint8Array} based on the
 * provided markdown string.
 */
export async function generate(
  md: string,
  options: GenerateOptions = {},
): Promise<Uint8Array> {
  const server = await serve(md, options);
  const browser = await launch();
  const page = await browser.newPage(`http://localhost:${server.addr.port}/`);
  const {
    printBackground = true,
    preferCSSPageSize = true,
    ...pdfOptions
  } = options;
  const pdf = await page.pdf({
    printBackground,
    preferCSSPageSize,
    ...pdfOptions,
  });

  await browser.close();
  await server.shutdown();
  return pdf;
}
