<script setup lang="ts">
import type {
  AiGenerateQuestionReqDTO,
  QuestionContentDTO
} from '@/api/models/user/question/QuestionDTO'
import { ref } from 'vue'
import { aiGenerate } from '@/api/controller/user/questionController'
import { Message } from '@arco-design/web-vue'
import { useQuestionStore } from '@/stores/questionStore'

interface Props {
  appId: string
  onSuccess?: (result: QuestionContentDTO[]) => void
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
const handleSubmit = async () => {
  if (props.appId === '') {
    return
  }
  // 关闭抽屉
  handleCancel()
  if (props.onSSEStart){
    props.onSSEStart(null)
  }
  // submitting.value = true
  try {
    const result = await aiGenerate({
      ...form.value,
      aiGenerateQuestionId: questionStore.aiGenerateQuestionId
    })
    if (result.data?.questionContent && result.data.questionContent.length > 0) {
      //不为空才算成功
      if (props.onSuccess) {
        props.onSuccess(result.data.questionContent ?? [])
      }
      if (result.data?.aiGenerateQuestionId) {
        questionStore.setAiGenerateQuestionId(result.data.aiGenerateQuestionId)
      }
      // Message.success('生成题目成功')
    }
    // Message.success(`生成题目成功，共生成${form.value.questionNumber}道题`)

  } catch (e: any) {
    Message.error('操作失败：' + e)
  }finally {
    if (props.onSSEClose){
      props.onSSEClose(null)
    }
  }
  // submitting.value = false
}
const handleSSESubmit = () => {
  if (props.appId === '') {
    return
  }
  props.onSSEStart?.(null)
  //关闭抽屉
  handleCancel()
  //TODO 手动跟换完整的SSE请求地址
  //原生的EventSource，无法设置请求头,只能在请求参数中携带了
  const eventSource = new EventSource(
    import.meta.env.VITE_REQUEST_HOST+'/question/aiGenerate/sse' +
      `?appId=${props.appId}&questionNumber=${form.value.questionNumber}` +
      `&optionNumber=${form.value.optionNumber}&aiGenerateQuestionId=${questionStore.aiGenerateQuestionId}` +
      `&token=${localStorage.getItem('token')}`
  )
  eventSource.onmessage = function (event) {
    const result = JSON.parse(event.data)
    console.log(result)
    questionStore.setAiGenerateQuestionId(result.aiGenerateQuestionId)
    props.onSSESuccess?.(result)
  }
  eventSource.onerror = function (event) {
    if (event.eventPhase === EventSource.CLOSED) {
      //正常关闭
      console.log('连接关闭')
      props.onSSEClose?.(event)
    }
    eventSource.close()
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
      <a-form :model="form" label-align="left" auto-label-width @submit="handleSubmit">
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
              <!--{{ submitting ? '生成中' : '一键生成' }}-->
              一键生成
            </a-button>
            <a-button @click="handleSSESubmit" style="width: 100px">
              <!--{{ submitting ? '生成中' : '实时生成' }}-->
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
