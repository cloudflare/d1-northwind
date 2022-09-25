import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { string } from "rollup-plugin-string";

export default [
    {
        input: "worker/index.ts",
        output: {
            exports: "named",
            format: "es",
            file: "dist/index.mjs",
            sourcemap: true,
        },
        plugins: [
            string({
                include: ["worker/templates/page.html"],
            }),
            typescript(),
            commonjs(),
            nodeResolve({ browser: true }),
            terser(),
        ],
    },
];
