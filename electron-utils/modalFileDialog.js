const { dialog } = require('electron');

class ModalFileDialog {
  constructor(window) {
    this.window = window;
  }

  async showOpenDialog(options = {}) {
    try {
      const defaultOptions = {
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: '所有文件', extensions: ['*'] }
        ]
      };

      const result = await dialog.showOpenDialog(
        this.window,
        { ...defaultOptions, ...options }
      );

      return {
        canceled: result.canceled,
        filePaths: result.filePaths
      };
    } catch (error) {
      console.error('打开文件对话框失败:', error);
      throw error;
    }
  }
}

module.exports = ModalFileDialog; 