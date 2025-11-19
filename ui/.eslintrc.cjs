/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	ignorePatterns: ['src/assets/fontawesome-pro/**/*', 'src/packages/**/*'],
	root: true,
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier/skip-formatting',
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		'vue/multi-word-component-names': 'off',
		'vue/component-name-in-template-casing': [
			'error',
			'PascalCase',
			{
				registeredComponentsOnly: true,
				ignores: [],
			},
		],
	},
}
