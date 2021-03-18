const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/electron-preferences/build/style.css', to: 'native_modules/style.css' },
        { from: 'node_modules/electron-preferences/build/css/vendor.css', to: 'native_modules/css/vendor.css' },
        { from: 'node_modules/electron-preferences/build/js/vendor.js', to: 'native_modules/js/vendor.js' },
        { from: 'node_modules/electron-preferences/build/js/app.bundle.js', to: 'native_modules/js/app.bundle.js' },
        { from: 'node_modules/electron-preferences/build/fonts', to: 'native_modules/fonts' },
        { from: 'node_modules/electron-preferences/build/svg', to: 'native_modules/svg' },
      ]
    }),
  ]
};
