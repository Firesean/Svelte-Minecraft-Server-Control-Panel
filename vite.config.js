import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [svelte()],
    define: {
      'process.env.RCON_PASSWORD': env.RCON_PASSWORD,
      'process.env.RCON_PORT': env.RCON_PORT,
      'process.env.RCON_HOST': env.RCON_HOST,
    },
  };
});
