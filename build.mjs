import fs from 'node:fs';
import * as esbuild from 'esbuild';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

await esbuild.build({
  entryPoints: ['src/index.js'],
  outfile: 'src/index.min.js',
  banner: {
    js: `/* early-errors v${pkg.version} */`,
  },
  minify: true,
  logLevel: 'info',
});
