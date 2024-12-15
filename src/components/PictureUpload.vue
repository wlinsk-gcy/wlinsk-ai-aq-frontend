<script setup lang="ts">
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { computed, ref, watchEffect } from 'vue'
import { Message } from '@arco-design/web-vue'
import { uploadFile } from '@/api/controller/fileController'
import type { UploadRespDTO } from '@/api/models/fileUpload/UploadRespDTO'

/**
 * 定义组件属性类型
 */
interface Props {
  //上传图片后的回调，给父组件的成员赋值上传成功后的url地址
  onChange?: (url: string) => void
  //已经上传的图片地址
  value?: string
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => ''
})
const file = ref()

const resetFileValue = () => {
  file.value = { url: props.value, percent: 100, status: 'done' }
}

/**
 * 自定义上传逻辑
 * @param option
 */
const customRequest: any = async (option: any) => {
  //拿到组件的参数
  const { fileItem, onError, onSuccess } = option
  try {
    const result = await uploadFile(fileItem.file)
    const data = result.data as UploadRespDTO
    file.value = {
      name: data.fileName,
      file: fileItem.file,
      url: data.imageUrl
    }
    props.onChange?.(data.imageUrl)
    onSuccess()
    // return result
  } catch (e: any) {
    Message.error(e)
    onError(e)
  }
}
watchEffect(() => {
  //监听父组件的value属性变化，如果变化了，则更新file的值
  resetFileValue()
})
</script>

<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-upload
      :fileList="file ? [file] : []"
      :show-file-list="false"
      :custom-request="customRequest"
    >
      <template #upload-button>
        <div
          :class="`arco-upload-list-item${
            file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
          }`"
        >
          <div class="arco-upload-list-picture custom-upload-avatar" v-if="file && file.url">
            <img :src="file.url" />
            <div class="arco-upload-list-picture-mask">
              <IconEdit />
            </div>
            <a-progress
              v-if="file.status === 'uploading' && file.percent < 100"
              :percent="file.percent"
              type="circle"
              size="mini"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)'
              }"
            />
          </div>
          <div class="arco-upload-picture-card" v-else>
            <div class="arco-upload-picture-card-text">
              <IconPlus />
              <div style="margin-top: 10px; font-weight: 600">Upload</div>
            </div>
          </div>
        </div>
      </template>
    </a-upload>
  </a-space>
</template>

<style scoped></style>
