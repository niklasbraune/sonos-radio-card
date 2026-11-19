import { esbuildPlugin } from "@web/dev-server-esbuild";

// Uses a locally installed Chrome. Set CHROME_PATH to use another Chromium
// browser such as Microsoft Edge.
export default {
  files: "test/browser/**/*.test.ts",
  nodeResolve: true,
  plugins: [
    esbuildPlugin({ ts: true, target: "es2022", tsconfig: "tsconfig.json" }),
  ],
  testFramework: {
    config: { timeout: 5000 },
  },
};
