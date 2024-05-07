import { app } from "electron";
import path from "path";
import ElectronPreferences from "electron-preferences";

import { showDevTools } from "./utils";
import { DEFAULT_VALUES } from "../renderer/utils";

const preferences = new ElectronPreferences({
  dataStore: path.join(app.getPath("userData"), "preferences.json"),
  webPreferences: {
    devTools: showDevTools(),
  },
  browserWindowOverrides: {
    title: "Synvert GUI Preferences",
  },
  defaults: {
    ...DEFAULT_VALUES,
    custom: {},
  },
  sections: [
    {
      id: "ruby",
      label: "Ruby",
      form: {
        groups: [
          {
            fields: [
              {
                label: "Enable synvert ruby",
                key: "enabled",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Synvert ruby bin path (directory containing synvert-ruby command, e.g. if you are using rbenv, it should be /Users/username/.rbenv/shims)",
                key: "bin_path",
                type: "text",
              },
              {
                label: "Number of workers to run in parallel",
                key: "number_of_workers",
                type: "number",
              },
              {
                label: "Prefer single quote",
                key: "single_quote",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Prefer tab width",
                key: "tab_width",
                type: "number",
              },
            ],
          },
        ],
      },
    },
    {
      id: "javascript",
      label: "Javascript",
      form: {
        groups: [
          {
            fields: [
              {
                label: "Enable synvert javascript",
                key: "enabled",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Synvert javascript bin path (directory containing synvert-javascript command)",
                key: "bin_path",
                type: "text",
              },
              {
                label: "Skip file if its size is more than the size. (KB)",
                key: "max_file_size",
                type: "number",
              },
              {
                label: "Prefer single quote",
                key: "single_quote",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Prefer semicolon",
                key: "semi",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Prefer tab width",
                key: "tab_width",
                type: "number",
              },
            ],
          },
        ],
      },
    },
    {
      id: "typescript",
      label: "Typescript",
      form: {
        groups: [
          {
            fields: [
              {
                label: "Enable synvert typescript",
                key: "enabled",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Skip file if its size is more than the size. (KB)",
                key: "max_file_size",
                type: "number",
              },
              {
                label: "Prefer single quote",
                key: "single_quote",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Prefer semicolon",
                key: "semi",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Prefer tab width",
                key: "tab_width",
                type: "number",
              },
            ],
          },
        ],
      },
    },
    {
      id: "css",
      label: "Css",
      form: {
        groups: [
          {
            fields: [
              {
                label: "Enable synvert css",
                key: "enabled",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Skip file if its size is more than the size. (KB)",
                key: "max_file_size",
                type: "number",
              },
            ],
          },
        ],
      },
    },
    {
      id: "less",
      label: "Less",
      form: {
        groups: [
          {
            fields: [
              {
                label: "Enable synvert less",
                key: "enabled",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Skip file if its size is more than the size. (KB)",
                key: "max_file_size",
                type: "number",
              },
            ],
          },
        ],
      },
    },
    {
      id: "sass",
      label: "Sass",
      form: {
        groups: [
          {
            fields: [
              {
                label: "Enable synvert sass",
                key: "enabled",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Skip file if its size is more than the size. (KB)",
                key: "max_file_size",
                type: "number",
              },
            ],
          },
        ],
      },
    },
    {
      id: "scss",
      label: "Scss",
      form: {
        groups: [
          {
            fields: [
              {
                label: "Enable synvert scss",
                key: "enabled",
                type: "checkbox",
                options: [{ label: "Enabled", value: "yes" }],
              },
              {
                label: "Skip file if its size is more than the size. (KB)",
                key: "max_file_size",
                type: "number",
              },
            ],
          },
        ],
      },
    },
  ],
});

export default preferences;
