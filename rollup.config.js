import * as Path from "node:path";
import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

export default [
		{
			input: "src/aula.ts",
			output: {
				file: "dist/aula.js",
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
		input: "src/aula.ts",
		output: {
			file: "dist/min/aula.js",
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
				compilerOptions: {outDir: Path.dirname("dist/min/tsout")},
			}),
			terser()
		]
	}
];
