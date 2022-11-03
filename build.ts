const { build, serve } = require('esbuild')
const path = require('path')

const options = {
  define: { 'process.env.NODE_ENV': process.env.NODE_ENV },
  entryPoints: [path.resolve(__dirname, 'src/index.tsx')],
  bundle: true,
  target: 'es2016',
  platform: 'browser',
  minify: true,
  outdir: path.resolve(__dirname, 'build'),
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  loader: {
    '.png': 'file',
    '.gif': 'file',
  },
}


build(options).catch(err => {
  process.stderr.write(err.stderr)
  process.exit(1)
})
