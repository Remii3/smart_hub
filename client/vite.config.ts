/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
  },
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './') }],
  },
});
