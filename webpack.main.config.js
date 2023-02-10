const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main/main.js",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "node_modules/electron-preferences/build/app.js", to: "native_modules/app.js" },
        { from: "node_modules/electron-preferences/build/svg", to: "native_modules/svg" },
      ],
    }),
  ],
};
