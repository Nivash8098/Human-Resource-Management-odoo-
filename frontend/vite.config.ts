import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    envPrefix: ['VITE_', 'SUPABASE_'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@backend': path.resolve(__dirname, '../backend'),
        '@database': path.resolve(__dirname, '../database'),
      },
    },
    server: {
      // The project now lives across sibling frontend/, backend/, database/
      // folders, so the dev server needs permission to read outside of
      // frontend/ (its root) when it resolves cross-folder imports.
      fs: {
        allow: ['..'],
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
