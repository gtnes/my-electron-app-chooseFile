const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron'); // 需要引入 ipcMain
const path = require('path');
require('@electron/remote/main').initialize();
const ModalFileDialog = require('./electron-utils/modalFileDialog');

// 保存窗口引用，防止被垃圾回收
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false, // 禁用 remote 模块（使用 IPC 通信替代）
      webSecurity: false, // 禁用 web 安全
      // sandbox: true // 启用沙箱
    }
  });

  // 开发环境加载本地服务
  if (true) {
    mainWindow.loadURL('http://localhost:5173');
    // 打开开发工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// 处理文件路径请求
ipcMain.handle('get-file-paths', async (event, filePaths) => {
  return filePaths;
});

// IPC 处理函数
ipcMain.handle('show-file-dialog', async (event, options) => {
  const fileDialog = new ModalFileDialog(mainWindow);
  return await fileDialog.showOpenDialog(options);
});

ipcMain.handle('dialog:showFileDialog', async (event, options) => {
  const result = await dialog.showOpenDialog(options)
  return result
})

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});