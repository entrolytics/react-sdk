import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  fixedExtension: false,
  dts: false,
  clean: true,
  sourcemap: true,
  treeshake: true,
  minify: false,
  deps: { neverBundle: ['react', 'react-dom'] },
})
