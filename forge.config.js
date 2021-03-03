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
        "name": "snippets"
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
    [
      "@electron-forge/plugin-webpack",
      {
        "mainConfig": "./webpack.main.config.js",
        "renderer": {
          "config": "./webpack.renderer.config.js",
          "entryPoints": [
            {
              "html": "./src/index.html",
              "js": "./src/renderer.js",
              "name": "main_window"
            }
          ]
        }
      }
    ]
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

function publishMaybe() {
  if (process.env.GITHUB_TOKEN) {
    config.publishers = [
      {
        "name": "@electron-forge/publisher-github",
        "config": {
          "repository": {
            "owner": "xinminlabs",
            "name": "Snippets",
            "draft": true
          }
        }
      }
    ]
  }
}

notarizeMaybe();

publishMaybe();

// Finally, export it
module.exports = config;