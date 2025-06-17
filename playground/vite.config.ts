import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      // This ensures Monaco Editor's workers are properly loaded
      'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api.js',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Put Monaco editor in a separate chunk
          monaco: ['monaco-editor'],
        },
      },
    },
  },
});
