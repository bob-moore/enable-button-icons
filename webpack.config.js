/**
 * Wordpress dependencies
 */
const { getAsBooleanFromENV } = require("@wordpress/scripts/utils");
/**
 * External dependencies
 */
const path = require("path");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
/**
 * Check if the --experimental-modules flag is set.
 */
const hasExperimentalModulesFlag = getAsBooleanFromENV(
  "WP_EXPERIMENTAL_MODULES",
);
/**
 * Get default script config from @wordpress/scripts
 * based on the --experimental-modules flag.
 */
const defaultConfigs = hasExperimentalModulesFlag
  ? require("@wordpress/scripts/config/webpack.config")
  : [require("@wordpress/scripts/config/webpack.config")];

module.exports = () => {
  return defaultConfigs.map((config) => ({
    ...config,
    entry: {
      index: path.resolve(process.cwd(), "src/index.ts"),
      editor: path.resolve(process.cwd(), "src/editor.scss"),
      style: path.resolve(process.cwd(), "src/index.scss"),
    },
    performance: {
      ...config.performance,
      assetFilter: (assetFilename) => !/^\d+\.js$/.test(assetFilename),
    },
    plugins: [...config.plugins, new RemoveEmptyScriptsPlugin()],
  }));
};
