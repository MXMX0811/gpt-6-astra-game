import { build, transform } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const minify = !process.argv.includes('--dev');
const [javascript, stylesheet, template] = await Promise.all([
  build({
    absWorkingDir: root,
    entryPoints: ['src/app.js'],
    bundle: true,
    format: 'iife',
    target: 'es2020',
    minify,
    write: false,
    legalComments: 'inline',
    logLevel: 'warning',
  }),
  readFile(new URL('src/style.css', import.meta.url), 'utf8'),
  readFile(new URL('index.template.html', import.meta.url), 'utf8'),
]);
const css = await transform(stylesheet, { loader: 'css', minify, legalComments: 'inline' });
const js = javascript.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = template
  .replace('/* APP_CSS */', () => css.code)
  .replace('/* APP_JS */', () => js);
const output = new URL('dist/', import.meta.url);
await mkdir(output, { recursive: true });
await writeFile(new URL('index.html', output), html);
console.log(`Built dist/index.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
