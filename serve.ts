const { serve } = require('esbuild')
const path = require('path')

serve(
  {
    servedir: 'build',
    port: 8000,
  },
  {
    define: { 'process.env.NODE_ENV': process.env.NODE_ENV },
    entryPoints: [path.resolve(__dirname, 'src/index.tsx')],
    bundle: true,
    target: 'es2016',
    platform: 'browser',
    outdir: path.resolve(__dirname, 'build'),
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    loader: {
      '.png': 'file',
      '.gif': 'file',
    },
  }
).catch(err => {
  process.stderr.write(err.stderr)
  process.exit(1)
})
