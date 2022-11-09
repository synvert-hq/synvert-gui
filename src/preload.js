import { machineIdSync } from 'node-machine-id';
import { rubySpawn } from 'ruby-spawn';
import { EVENT_SYNC_SNIPPETS } from './renderer/constants';
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  isDev: () => process.env.DEBUG === "true",
  getToken: () => machineIdSync({ original: true }),
  getPreferences: () => ipcRenderer.sendSync("getPreferences"),
  setPreferences: (preferences) => ipcRenderer.sendSync("setPreferences", preferences),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),

  loadSnippets: async () => {
    const { output, error } = await new Promise((resolve) => {
      const child = rubySpawn('synvert-ruby', ['--list', '--format', 'json'], { encoding: 'utf8' }, true);
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
      child.on('exit', () => {
        return resolve({ output, error });
      });
    });
    return { stdout: output, stderr: error };
  },
  syncSnippets: async () => {
    const { output, error } = await new Promise((resolve) => {
      const child = rubySpawn('synvert-ruby', ['--sync'], { encoding: 'utf8' }, true);
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
      child.on('exit', () => {
        return resolve({ output, error });
      });
    });
    return { stdout: output, stderr: error };
  },

  onSyncSnippets: (callback) => ipcRenderer.on(EVENT_SYNC_SNIPPETS, callback),
})