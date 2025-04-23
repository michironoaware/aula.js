import * as Path from "node:path";
import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

export default [
		{
			input: "src/index.ts",
			output: {
				file: "dist/index.js",
				format: "es",
				name: "Aula",
				//dir: "dist",
				//preserveModules: true,
				//preserveModulesRoot: 'src',
			},
			treeshake: false,
			plugins: [
				typescript({
					tsconfig: 'tsconfig.json',
					compilerOptions: { outDir: Path.dirname("dist/tsout") },
				})
			]
		},
	{
		input: "src/index.ts",
		output: {
			file: "dist/index.min.js",
			format: "es",
			name: "Aula",
			//dir: "dist/min",
			//preserveModules: true,
			//preserveModulesRoot: 'src',
		},
		treeshake: false,
		plugins: [
			typescript({
				tsconfig: 'tsconfig.json',
				compilerOptions: {outDir: Path.dirname("dist/tsout")},
			}),
			terser()
		]
	}
];
