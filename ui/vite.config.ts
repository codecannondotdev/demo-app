import { sentryVitePlugin } from '@sentry/vite-plugin'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ mode }: any) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
	return defineConfig({
		plugins: [
			vue(),
			sentryVitePlugin({
				org: 'codecannon',
				project: 'generated-applications-vue',
			}),
		],

		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},

		server: {
			host: process.env.VITE_DEV_SERVER_HOST,
			port: Number(process.env.VITE_DEV_SERVER_PORT),
		},

		build: {
			sourcemap: true,
		},
	})
}
