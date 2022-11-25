import fs from "fs";
import path from "path";
import { machineIdSync } from 'node-machine-id';
import { spawn } from "child_process";
import { rubySpawn } from 'ruby-spawn';
import { execaCommand } from 'execa';
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  isDev: () => process.env.DEBUG === "true",
  getToken: () => machineIdSync({ original: true }),
  getPreferences: () => ipcRenderer.sendSync("getPreferences"),
  setPreferences: (preferences) => ipcRenderer.sendSync("setPreferences", preferences),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),

  pathJoin: (path1, path2) => path.join(path1, path2),
  readFile: (filePath) => fs.readFileSync(filePath, "utf-8"),
  writeFile: (filePath, fileContent) => fs.writeFileSync(filePath, fileContent),

  runRubyCommand: async (command, args, input = null) => {
    const { output, error } = await new Promise((resolve) => {
      const child = rubySpawn(command, args, { encoding: 'utf8' }, true);
      if (child.stdin && input) {
        child.stdin.write(input);
        child.stdin.end();
      }
      let output = '';
      if (child.stdout) {
        child.stdout.on('data', data => {
          output += data;
        });
      }
      let error = "";
      if (child.stderr) {
        child.stderr.on('data', data => {
          error += data;
        });
      }
      child.on('error', (e) => {
        return resolve({ error: e.message });
      });
      child.on('exit', () => {
        return resolve({ output, error });
      });
    });
    return { stdout: output, stderr: error };
  },

  runJavascriptCommand: async (command, args, input = null) => {
    const { output, error } = await new Promise((resolve) => {
      const child = spawn(command, args, { env: process.env, encoding: 'utf8' }, true);
      if (child.stdin && input) {
        child.stdin.write(input);
        child.stdin.end();
      }
      let output = '';
      if (child.stdout) {
        child.stdout.on('data', data => {
          output += data;
        });
      }
      let error = "";
      if (child.stderr) {
        child.stderr.on('data', data => {
          error += data;
        });
      }
      child.on('error', (e) => {
        return resolve({ error: e.message });
      });
      child.on('exit', () => {
        return resolve({ output, error });
      });
    });
    return { stdout: output, stderr: error };
  },

  runCommand: async (command) => {
    const { stdout, stderr } = await execaCommand(command, { shell: true });
    return { stdout, stderr };
  }
})