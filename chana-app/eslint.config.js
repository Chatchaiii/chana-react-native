// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    // example/ is the git-ignored starter template kept for reference
    ignores: ["dist/*", "example/*"],
  },
]);
