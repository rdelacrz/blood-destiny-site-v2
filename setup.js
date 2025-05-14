// Base ESBuild dependencies
import { context } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { sassPlugin } from 'esbuild-sass-plugin';

// PostCSS dependencies
import autoprefixer from 'autoprefixer';
import { globSync } from 'glob';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

// Needed to run the sass-plugin for tailwind content files
const sassPluginWatchPaths = ['./templates/*.html'].flatMap((pattern) => {
  return globSync(pattern, { ignore: 'node_modules/**' });
});

// This is the target directory where the assets will be copied
const targetDir = 'public';

// This is the main function that will be called to start the build process to watch for changes
async function watch() {
  const ctx = await context({
    entryPoints: ['./index.js'],
    bundle: true,
    allowOverwrite: true,
    outfile: `${targetDir}/main.js`,
    assetNames: 'vendor/[name]-[hash]',
    loader: {
      '.ttf': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
    plugins: [
      copy({
        // This is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: 'cwd',
        assets: {
          from: ['./assets/**/*'],
          to: [`${targetDir}/static`],
        },
        watch: true,
      }),
      sassPlugin({
        // Transforms Tailwind CSS files
        filter: /tailwind\.css/,
        async transform(source, resolveDir) {
          const { css } = await postcss([autoprefixer, tailwindcss]).process(source, {
            from: 'tailwind.css',
            map: false,
          });

          // Specify the loader, otherwise plugin tries to resolve the files as js
          // https://github.com/glromeo/esbuild-sass-plugin/blob/main/src/plugin.ts#L86
          return {
            loader: 'css',
            contents: css,
            watchFiles: sassPluginWatchPaths,
          };
        },
      })
    ],
  });

  await ctx.watch();
  console.log('Watching for changes...');
}

// IMPORTANT: this call MUST NOT have an `await`.
watch();
