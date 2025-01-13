<template>
  <div class="file-uploader">
    <span>{{ label }}：</span>
    <input type="text" v-model="selectedPath" :placeholder="placeholder">
    <button @click="selectFile">{{ buttonText }}</button>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '文件路径'
  },
  placeholder: {
    type: String,
    default: '请选择文件'
  },
  buttonText: {
    type: String,
    default: '选择文件'
  },
  // 文件选择配置选项
  dialogOptions: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['file-selected', 'error']);

const selectedPath = ref('');

async function selectFile() {
  try {
    // 使用预加载脚本中暴露的 API
    const result = await window.electronAPI.showFileDialog(props.dialogOptions);
    
    if (!result.canceled && result.filePaths.length > 0) {
      selectedPath.value = result.filePaths[0];
      emit('file-selected', {
        path: result.filePaths[0],
        paths: result.filePaths
      });
    }
  } catch (error) {
    console.error('文件选择失败:', error);
    emit('error', error);
  }
}
</script>

<style scoped>
.file-uploader {
  display: flex;
  align-items: center;
  gap: 10px;
}

input[type="text"] {
  flex: 1;
  padding: 5px;
}

button {
  padding: 5px 10px;
}
</style>