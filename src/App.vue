<template>
  <div>
    <div style="color: red; font-size: 16px; margin: 10px 0;">注意，项目使用的electron版本</div>
    <div style="color: #666; font-size: 14px; margin: 10px 0;">==========================方案1 electron dialog 文件上传=============================</div>
    <!-- electron dialog 文件上传 -->
    <FileUploader
      label="选择文件"
      placeholder="请选择一个文件"
      button-text="浏览..."
      :dialog-options="{
        filters: [
          { name: '图片文件', extensions: ['jpg', 'png', 'gif'] }
        ]
      }"
      @file-selected="handleFileSelected"
      @error="handleError"
    />

    <div style="color: #666; font-size: 14px; margin: 10px 0;">==========================方案2 Input File模式获取文件真实Path=============================</div>
    <!-- 添加传统文件输入框 -->
    <div class="file-input-container">
      <input
        type="file"
        multiple
        @change="handleInputFileChange"
        ref="fileInput"
        class="native-file-input"
      />
      <button @click="triggerFileInput" class="select-button">
        选择多个文件
      </button>

      <!-- 显示选中的文件 -->
      <div v-if="selectedFiles.length > 0" class="selected-files">
        <h3>已选择的文件：</h3>
        <ul>
          <li v-for="file in selectedFiles" :key="file.path">
            {{ file.path }}
          </li>
        </ul>
      </div>
    </div>

    <div style="color: #666; font-size: 14px; margin: 10px 0;">==========================方案3 拖放文件获取真实Path=============================</div>
    <!-- 添加拖放区域 -->
    <div
      class="drop-zone"
      :class="{ 'dragging': isDragging }"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <p>拖放文件模式获取Path <br> 拖放文件到这里</p>
      <div v-if="droppedFiles.length > 0" class="file-list">
        <p>已拖放的文件:</p>
        <ul>
          <li v-for="file in droppedFiles" :key="file.path">
            {{ file.path }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import FileUploader from './components/FileUploader.vue'
import { ref } from 'vue'

// 添加拖放状态
const isDragging = ref(false)
const droppedFiles = ref([])

// 添加新的响应式变量
const fileInput = ref(null)
const selectedFiles = ref([])

function handleFileSelected({ path, paths }) {
  console.log('选择的文件:', path);
  console.log('所有选择的文件:', paths);
}

function handleError(error) {
  console.error('发生错误:', error);
}

// 添加拖放处理函数
async function handleDrop(e) {
  e.preventDefault()
  isDragging.value = false
  
  try {
    const files = Array.from(e.dataTransfer.files)
    droppedFiles.value = files
    
    // 调试信息
    console.log('拖放的文件对象:', files)
    
    // 使用 DataTransfer.items 来获取路径
    const filePaths = []
    for (const item of e.dataTransfer.items) {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        const filePath = file.path || file.webkitRelativePath || file.name
        filePaths.push(filePath)
      }
    }
    
    console.log('收集到的文件路径:', filePaths)
    
    // 修改这部分代码，使用 electronAPI 而不是 ipcRenderer
    // const validPaths = filePaths.filter(path => /^[A-Za-z]:\\/.test(path))
    // if (validPaths.length > 0) {
    //   const normalizedPaths = await window.electronAPI.getFilePath(validPaths)
    //   console.log('规范化后的文件路径:', normalizedPaths)
    // } else {
    //   console.log('未能获取有效的本地文件路径')
    // }
  } catch (error) {
    console.error('获取文件路径失败:', error)
  }
}

function handleDragOver(e) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave(e) {
  e.preventDefault()
  isDragging.value = false
}

// 触发文件输入框点击
function triggerFileInput() {
  fileInput.value.click()
}

// 处理文件选择
async function handleInputFileChange(event) {
  console.log('文件选择事件触发')
  const files = Array.from(event.target.files)
  console.log('选择的文件:', files)  // 添加这行来查看文件对象
  
  try {
    const filePaths = files.map(file => {
      console.log('单个文件信息:', {
        name: file.name,
        path: file.path,
        size: file.size,
        type: file.type
      })
      return file.path
    })
    
    console.log('收集到的文件路径:', filePaths)
    
    // 检查 window.electronAPI 是否存在
    if (!window.electronAPI) {
      console.error('electronAPI 未定义')
      return
    }
    
    // 更新选中文件列表
    selectedFiles.value = files.map((file, index) => ({
      name: file.name,
      path: filePaths[index] || file.path
    }))
  } catch (error) {
    console.error('获取文件路径失败:', error)
    console.error('错误详情:', error.message)
  }
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
  min-height: 150px;
  transition: all 0.3s ease;
}

.drop-zone.dragging {
  background-color: #e9ecef;
  border-color: #42b883;
}

.file-list {
  margin-top: 15px;
  text-align: left;
}

.file-list ul {
  list-style: none;
  padding: 0;
}

.file-list li {
  margin: 5px 0;
  padding: 5px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.file-input-container {
  margin: 20px 0;
  text-align: center;
}

.native-file-input {
  display: none;
}

.select-button {
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.select-button:hover {
  background-color: #3aa876;
}

.selected-files {
  margin-top: 15px;
  text-align: left;
}

.selected-files ul {
  list-style: none;
  padding: 0;
}

.selected-files li {
  margin: 5px 0;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  word-break: break-all;
}
</style>
