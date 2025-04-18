import typescript from "@rollup/plugin-typescript";

/**
 * Rollup configuration for building the application.
 * @type {import('rollup').RollupOptions}
 */
export default {
	/**
	 * External dependencies that should not be bundled.
	 * These are either Node.js built-in modules or dependencies that will be installed.
	 */
	external: ["chalk", "cosmiconfig", "node:child_process", "node:util", "path-to-regexp", "yargs", "inquirer"],

	/**
	 * Entry point for the application.
	 */
	input: "src/index.ts",

	/**
	 * Output configuration.
	 */
	output: {
		/** Add shebang to make the output file executable directly with Node.js */
		banner: "#!/usr/bin/env node",
		/** Output directory */
		dir: "bin",
		/** How exports from the entry module are exposed */
		exports: "auto",
		/** Output format (ES modules) */
		format: "esm",
		/** Preserve module structure rather than bundling all into a single file */
		preserveModules: false,
		/** Generate source maps for debugging */
		sourcemap: true,
	},

	/**
	 * Plugins used during the build process.
	 */
	plugins: [
		/**
		 * TypeScript plugin for transpiling TypeScript to JavaScript.
		 */
		typescript({
			/** Generate .d.ts declaration files */
			declaration: true,
			/** Output directory for generated files */
			outDir: "bin",
			/** Generate source maps for debugging */
			sourceMap: true,
			/** Path to TypeScript configuration file */
			tsconfig: "./tsconfig.json",
		}),
	],
};
