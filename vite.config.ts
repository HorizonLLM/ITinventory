import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for the IT inventory app.
// `dev`/`preview` scripts in package.json pin the host and port (0.0.0.0:3001)
// so the systemd unit and LAN devices can reach it.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3001,
  },
  preview: {
    host: true,
    port: 3001,
    strictPort: true,
  },
});
