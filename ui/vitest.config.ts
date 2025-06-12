import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((params) =>
	mergeConfig(
		viteConfig(params),
		defineConfig({
			test: {
				environment: 'jsdom',
				exclude: [...configDefaults.exclude, 'e2e/*'],
				root: fileURLToPath(new URL('./', import.meta.url)),
				typecheck: {
					enabled: true,
					include: ['**/*.spec.ts'],
				},
			},
		}),
	),
)
