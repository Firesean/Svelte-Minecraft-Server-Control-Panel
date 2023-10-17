import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [svelte()],
    define: {
      'process.env.RCON_PASSWORD': JSON.stringify(env.RCON_PASSWORD),
      'process.env.RCON_PORT': JSON.stringify(env.RCON_PORT),
      'process.env.RCON_HOST': JSON.stringify(env.RCON_HOST),
    },
  };
});
