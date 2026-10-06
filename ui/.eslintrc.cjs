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
		'vue/attributes-order': [
			'warn',
			{
				order: [
					'DEFINITION',
					'LIST_RENDERING',
					'CONDITIONALS',
					'RENDER_MODIFIERS',
					'GLOBAL',
					['UNIQUE', 'SLOT'],
					'TWO_WAY_BINDING',
					'OTHER_DIRECTIVES',
					['ATTR_STATIC', 'ATTR_SHORTHAND_BOOL'],
					'ATTR_DYNAMIC',
					'EVENTS',
					'CONTENT',
				],
				alphabetical: true,
			},
		],
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
