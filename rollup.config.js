import { readFileSync } from "node:fs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";

const { version } = JSON.parse(readFileSync("./package.json", "utf8"));

export default {
  input: "src/index.ts",
  output: {
    file: "dist/sonos-radio-card.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: { __VERSION__: JSON.stringify(version) },
    }),
    nodeResolve(),
    typescript(),
  ],
};
