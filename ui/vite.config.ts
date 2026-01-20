import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default ({ mode }: any) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
	return defineConfig({
		plugins: [vue()],

		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},

		server: {
			host: process.env.VITE_DEV_SERVER_HOST,
			port: Number(process.env.VITE_DEV_SERVER_PORT),
			watch: {
				ignored: [`${__dirname}/src/packages/**`, `${__dirname}/src/assets/fontawesome-pro/**`],
			},
		},

		build: {
			sourcemap: true,
		},
	})
}
