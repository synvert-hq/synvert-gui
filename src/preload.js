import fs from "fs";
import promiseFs from "fs/promises";
import path from "path";
import { machineIdSync } from "node-machine-id";
import { runShellCommand } from "synvert-server-common";
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
  pathJoin: (path1, path2) => path.join(path1, path2),
  readFile: (filePath) => fs.readFileSync(filePath, "utf-8"),
  writeFile: (filePath, fileContent) => fs.writeFileSync(filePath, fileContent),
  unlinkFile: (filePath) => fs.unlinkSync(filePath),
  mkdir: (filePath) => fs.mkdirSync(filePath, { recursive: true }),
  dirname: (filePath) => path.dirname(filePath),

  runShellCommand,
});
