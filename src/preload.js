import promiseFs from "fs/promises";
import path from "path";
import { machineIdSync } from "node-machine-id";
import { runShellCommand } from "@synvert-hq/synvert-server-common";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isDev: () => process.env.DEBUG === "true",
  getToken: () => machineIdSync({ original: true }),
  getPreferences: () => ipcRenderer.sendSync("getPreferences"),
  setPreferences: (preferences) => ipcRenderer.sendSync("setPreferences", preferences),
  onPreferenceUpdated: (callback) => ipcRenderer.on("preferencesUpdated", callback),
  openFile: () => ipcRenderer.invoke("dialog:openFile"),

  pathAPI: path,
  promiseFsAPI: promiseFs,

  runShellCommand,
});
