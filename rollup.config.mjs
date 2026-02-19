import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const external = ["react"];

/** @type {import('rollup').RollupOptions[]} */
export default [
    // ESM + CJS bundle
    {
        input: "src/index.ts",
        external,
        output: [
            {
                file: "dist/index.cjs.js",
                format: "cjs",
                sourcemap: true,
                exports: "named",
            },
            {
                file: "dist/index.esm.js",
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [
            typescript({
                tsconfig: "./tsconfig.json",
                declaration: true,
                declarationDir: "dist/types",
            }),
        ],
    },
    // Type declarations bundle
    {
        input: "dist/types/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
    },
];
