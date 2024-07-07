// import globals from "globals";
// import pluginJs from "@eslint/js";
import tseslint from 'typescript-eslint';

// export default ;

export default [
	...tseslint.config({
		files: ['src/*.ts'],
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		ignores: [
			'node_modules/*',
			'dist/*',
			'**/*.mjs',
			'**/rollup.config.mjs',
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: true,
			},
		},
		rules: {
			'@typescript-eslint/no-unsafe-argument': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-member-access': 'error',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/no-unused-vars': 'error',
		},
	}),
	{
		ignores: ['node_modules', 'dist', '**/*.mjs', '**/rollup.config.mjs'],
	},
];
