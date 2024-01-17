const {contextBridge, ipcRenderer } = require("electron")
contextBridge.exposeInMainWorld("host_script", {
    open: () => {
      ipcRenderer.send('message-from-renderer');
    }
})