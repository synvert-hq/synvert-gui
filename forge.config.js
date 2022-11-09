require('dotenv').config()

const config = {
  packagerConfig: {
    "osxSign": {
      "identity": "Developer ID Application: Zhimin Huang (9S5K3LWH74)",
      "hardened-runtime": true,
      "gatekeeper-assess": false,
      "entitlements": "entitlements.plist",
      "entitlements-inherit": "entitlements.plist",
      "signature-flags": "library"
    }
  },
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "Synvert"
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {}
    },
    {
      "name": "@electron-forge/maker-rpm",
      "config": {}
    }
  ],
  "plugins": [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              name: "main_window",
              html: "./src/renderer/index.html",
              js: "./src/renderer/renderer.js",
              preload: {
                js: "./src/preload.js"
              }
            }
          ],
        },
        devContentSecurityPolicy: "script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:9292 http://api-ruby.synvert.net; img-src 'self' http://localhost:9292 http://api-ruby.synvert.net; default-src 'self' http://localhost:9292 https://api-ruby.synvert.net;"
      }
    }
  ]
}

function notarizeMaybe() {
  if (process.platform !== 'darwin') {
    return;
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.warn(
      'Should be notarizing, but environment variables APPLE_ID or APPLE_ID_PASSWORD are missing!',
    );
    return;
  }

  config.packagerConfig.osxNotarize = {
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD
  };
}

function updateIcon() {
  if (process.platform === 'darwin') {
    config.packagerConfig.icon = "./src/icons/mac/icon.icns"
  }
  if (process.platform === 'win32') {
    config.packagerConfig.icon = "./src/icons/win/icon.ico"
  }
}

notarizeMaybe();
updateIcon();

// Finally, export it
module.exports = config;
