import { terser } from "rollup-plugin-terser";
// import { string } from "rollup-plugin-string";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";
import replace from "@rollup/plugin-replace";

export default [
    {
        input: "app/index.jsx",
        cache: true,
        onwarn: function (message, warn) {
            // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
            if (message.code == "THIS_IS_UNDEFINED") return;
            warn(message);
        },
        output: {
            format: "iife",
            file: "dist/app.js",
            sourcemap: true,
        },
        plugins: [
            babel({
                presets: ["@babel/preset-react"],
                babelHelpers: "bundled",
                exclude: "node_modules/**",
                compact: false,
            }),
            replace({
                "process.env.NODE_ENV": JSON.stringify("production"),
                preventAssignment: true,
            }),
            postcss({
                plugins: [postcssImport(), tailwindcss(), autoprefixer(), postcssNested()],
                extensions: [".css"],
                extract: true,
                minimize: true,
            }),
            commonjs(),
            nodeResolve({ browser: true }),
            terser(),
        ],
    },
];
