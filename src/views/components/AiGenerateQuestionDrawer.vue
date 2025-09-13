<script setup lang="ts">
import type {
  AiGenerateQuestionReqDTO,
  QuestionContentDTO
} from '@/api/models/user/question/QuestionDTO'
import { ref } from 'vue'
import { aiGenerate } from '@/api/controller/user/questionController'
import { Message } from '@arco-design/web-vue'
import { useQuestionStore } from '@/stores/questionStore'
import { useUserStore } from '@/stores/userStore'

interface Props {
  appId: string
  onSSESuccess?: (result: QuestionContentDTO) => void
  onSSEStart?: (event: any) => void
  onSSEClose?: (event: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return ''
  }
})
const questionStore = useQuestionStore()
const form = ref<AiGenerateQuestionReqDTO>({
  appId: props.appId,
  optionNumber: 3,
  questionNumber: 5
})
const userStore = useUserStore()
//抽屉是否展示
const visible = ref(false)
//是否正在提交表单
const submitting = ref(false)
const handleClick = () => {
  visible.value = true
}
const handleOk = () => {
  visible.value = false
}
const handleCancel = () => {
  visible.value = false
}
const controller = new AbortController()
const handleStreamSubmit = async () => {
  if (props.appId === '') {
    return
  }
  await userStore.fetchLoginUser()
  if (userStore.userAIPoint <= 0) {
    Message.error('今日的AI积分已用完，请明天再来~')
    return
  }
  props.onSSEStart?.(null)
  //关闭抽屉
  handleCancel()
  try {
    const response = await fetch(import.meta.env.VITE_REQUEST_HOST + `/chat/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        appId: props.appId,
        questionNumber: form.value.questionNumber,
        optionNumber: form.value.optionNumber,
        aiGenerateQuestionId: questionStore.aiGenerateQuestionId
      }),
      signal: controller.signal // 将 AbortController 的 signal 传递给 fetch
    })
    if (!response.body) {
      console.error('No response body')
      return
    }
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      // 以 \n\n 作为一条完整 SSE 消息的分隔符
      const parts = buffer.split('\n\n')
      buffer = parts.pop() ?? '' // 留下最后半截，等下次再拼
      for (const part of parts) {
        const line = part.trim()
        if (!line.startsWith('data:')) continue
        const jsonString = line.replace(/^data:\s*/, '')
        try {
          const json = JSON.parse(jsonString)
          if (json.eventType === 1001 && json.eventData && json.eventData !== 'null') {
            questionStore.setAiGenerateQuestionId(json.eventData.aiGenerateQuestionId)
            props.onSSESuccess?.(json.eventData)
          } else if (json.eventType === 1002) {
            // console.log('事件流结束')
            props.onSSEClose?.(json.eventType)
          } else if (json.eventType === 1004 && json.eventData) {
            Message.error(json.eventData)
            return
          }
        } catch (e) {
          console.error('JSON解析失败：', line)
        }
      }
    }
  } catch (err) {
    Message.error('题目生成失败，请稍后重试')
  } finally {
    await userStore.fetchLoginUser()
  }
}
</script>

<template>
  <a-button type="outline" @click="handleClick">AI 生成题目</a-button>
  <a-drawer
    :width="340"
    :footer="false"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    unmountOnClose
  >
    <template #title>AI 生成题目</template>
    <div>
      <a-form :model="form" label-align="left" auto-label-width @submit="handleStreamSubmit">
        <a-form-item label="应用 id">
          {{ appId }}
        </a-form-item>
        <a-form-item field="questionNumber" label="题目数量">
          <a-input-number
            :min="1"
            :max="10"
            v-model="form.questionNumber"
            placeholder="请输入题目数量"
          />
        </a-form-item>
        <a-form-item field="optionNumber" label="选项数量">
          <a-input-number
            :min="2"
            :max="5"
            v-model="form.optionNumber"
            placeholder="请输入选项数量"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button :loading="submitting" type="primary" html-type="submit" style="width: 100px">
              实时生成
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <a-alert>温馨提示：AI生成的题目会在底部追加。</a-alert>
    </div>
  </a-drawer>
</template>

<style scoped lang="scss"></style>
