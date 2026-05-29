import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  runPython: (code: string) => ipcRenderer.invoke('run-python', code),
});
