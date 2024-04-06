import FullReload from 'vite-plugin-full-reload'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [FullReload(['**/*.html'])],
  public: './public',
  preserveSymlinks: true,
})
