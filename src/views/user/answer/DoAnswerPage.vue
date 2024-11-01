<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref, watchEffect } from 'vue'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'
import type { QuestionContentDTO } from '@/api/models/user/question/QuestionDTO'
import { queryById } from '@/api/controller/user/appController'
import { queryPage } from '@/api/controller/user/questionController'
import { Message } from '@arco-design/web-vue'
import { add } from '@/api/controller/user/userAnswerController'
import type { RadioOption } from '@arco-design/web-vue/es/radio/interface'

interface Props {
  appId: string
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return ''
  }
})

const router = useRouter()
const appInfo = ref<QueryAppDetailsRespDTO>({})
// 题目内容结构（理解为题目列表）
const questionContent = ref<QuestionContentDTO[]>([])
// 当前题目的序号（从 1 开始）
const current = ref(1)
// 当前题目
const currentQuestion = ref<QuestionContentDTO>({})
// 当前题目选项
const questionOptions = computed<(string | number | RadioOption)[]>((): (string | number | RadioOption)[] => {
  return currentQuestion.value?.options?.map((option) => {
    return {
      label: `${option.key}. ${option.value}`,
      value: option.key
    } as RadioOption
  })?? [] as (string | number | RadioOption)[]
})
// 当前答案
const currentAnswer = ref<string>()
// 回答列表
const answerList = ref<string[]>([])
// 是否正在提交结果
const submitting = ref(false)
const loadData = async () => {
  if (props.appId === '') {
    return
  }
  try {
    const appResult = await queryById(props.appId)
    appInfo.value = appResult.data as QueryAppDetailsRespDTO
    const questionResult = await queryPage({ appId: props.appId, pageNum: 1, pageSize: 1 })
    questionContent.value = questionResult.data?.records[0].questionContent ?? []
  } catch (e: any) {
    Message.error('获取数据失败：' + e)
  }
}
/**
 * 选中选项后，保存选项记录
 * @param value
 */
const doRadioChange = (value: (string | number | boolean), ev: Event) => {
  answerList.value[current.value - 1] = value as string
}
const doSubmit = async () => {
  if (props.appId === '' || answerList.value.length === 0){
    return
  }
  try {
    submitting.value = true;
    const result = await add({ appId: props.appId, choices: answerList.value })
    Message.success('评分已完成')
    await router.replace(`/answer/result/${result.data}`)
  } catch (e: any) {
    Message.error('提交答案失败: ' + e)
  } finally {
    submitting.value = false;
  }
}
// 获取旧数据
watchEffect(() => {
  loadData()
})
// 监听current的变化，改变 current 题号后，会自动更新当前题目和答案
watchEffect(() => {
  currentQuestion.value = questionContent.value[current.value - 1]
  currentAnswer.value = answerList.value[current.value - 1]
})
</script>

<template>
  <div id="doAnswerPage">
    <a-card>
      <h1>{{ appInfo.appName }}</h1>
      <p>{{ appInfo.appDesc }}</p>
      <p class="h2" style="margin-bottom: 16px">{{ current }}、{{ currentQuestion?.title }}</p>
      <div>
        <a-radio-group
          direction="vertical"
          v-model="currentAnswer"
          :options="questionOptions"
          @change="doRadioChange"
        />
      </div>
      <div style="margin-top: 24px">
        <a-space size="large">
          <a-button
            type="primary"
            circle
            v-if="current < questionContent.length"
            :disabled="!currentAnswer"
            @click="current += 1"
          >
            下一题
          </a-button>
          <a-button
            type="primary"
            v-if="current === questionContent.length"
            :loading="submitting"
            circle
            :disabled="!currentAnswer"
            @click="doSubmit"
          >
            {{ submitting ? "评分中" : "查看结果" }}
          </a-button>
          <a-button v-if="current > 1" circle @click="current -= 1">
            上一题
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<style scoped lang="scss">
#doAnswerPage {
  .h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
  }
}
</style>
