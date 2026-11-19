import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/sonos-radio-card.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [nodeResolve(), typescript()],
};
