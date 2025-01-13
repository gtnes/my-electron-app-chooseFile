const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  showFileDialog: (options) => ipcRenderer.invoke('dialog:showFileDialog', options),
  getFilePath: (paths) => ipcRenderer.invoke('get-file-path', paths)
})