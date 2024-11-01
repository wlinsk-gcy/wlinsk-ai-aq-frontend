<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type {
  QueryQuestionPageRespDTO,
  QuestionContentDTO
} from '@/api/models/user/question/QuestionDTO'
import { queryPage, updateQuestion, addQuestion } from '@/api/controller/user/questionController'
import { Message, Modal } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import { IconRight, IconDown } from '@arco-design/web-vue/es/icon'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'
import { queryById } from '@/api/controller/user/appController'
import { ScoringStrategyEnum } from '@/api/models/enums/ScoringStrategyEnum'
import { AppTypeEnum } from '@/api/models/enums/AppTypeEnum'
import AiGenerateQuestionDrawer from '@/views/components/AiGenerateQuestionDrawer.vue'

interface Props {
  appId?: string
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return ''
  }
})
type QuestionContentDTOWithCustomField = QuestionContentDTO & {
  //是否显示题目选项
  isShow?: boolean
}
//是否正在提交表单
const submitting = ref(false)
const appInfo = ref<QueryAppDetailsRespDTO>({})
const router = useRouter()
const oldQuestion = ref<QueryQuestionPageRespDTO>()
//题目内容结构
// const questionContent = ref<QuestionContentDTO[]>([])
const questionContent = ref<QuestionContentDTOWithCustomField[]>([])
//添加题目
const addQuestionForForm = (index: number) => {
  questionContent.value.splice(index, 0, {
    title: '',
    options: [],
    // 默认不显示题目选项
    isShow: false
  })
}
//删除题目
const deleteQuestion = (index: number) => {
  questionContent.value.splice(index, 1)
}
//添加题目选项
const addQuestionOption = (question: QuestionContentDTOWithCustomField, index: number) => {
  //添加选项时，如果题目选项是隐藏的，则展开
  if (!question.isShow) {
    question.isShow = true
  }
  question.options?.splice(index, 0, {
    key: '',
    value: ''
  })
}
//删除题目选项
const deleteQuestionOption = (question: QuestionContentDTO, index: number) => {
  question.options?.splice(index, 1)
}
const doClickOptionsIcon = (question: QuestionContentDTOWithCustomField) => {
  question.isShow = !question.isShow
}
//提交表单
const handleSubmit = async () => {
  if (props.appId === '' || questionContent.value.length === 0) {
    return
  }
  submitting.value = true
  try {
    const array = questionContent.value.map((item) => item.title)
    const uniqueArray = [...new Set(array)]
    if (array.length !== uniqueArray.length) {
      Message.error('存在重复的题目，请确保题目唯一')
      return
    }
    questionContent.value.forEach((question) => {
      question.title = question.title?.trim()
      question.options?.forEach((option) => {
        option.key?.trim()
        option.value?.trim()
        option.result?.trim()
      })
    })
    //发送请求前把isShow字段过滤掉
    const reqDTO = questionContent.value.map(({ isShow, ...rest }) => rest)
    if (oldQuestion.value?.questionId) {
      await updateQuestion({
        questionId: oldQuestion.value.questionId,
        questionContent: reqDTO
      })
    } else {
      await addQuestion({
        appId: props.appId,
        questionContent: reqDTO
      })
    }
    Message.success('操作成功，为您跳转到应用详情页')
    await router.push(`/app/details/${props.appId}`)
  } catch (e: any) {
    Message.error('操作失败，' + e)
  } finally {
    submitting.value = false
  }
}
//获取当前应用的最新题目数据
const loadData = async () => {
  if (props.appId === '' || props.appId.startsWith('__arco_menu')) {
    return
  }
  try {
    const appResult = await queryById(props.appId)
    appInfo.value = appResult.data as QueryAppDetailsRespDTO
    const result = await queryPage({ appId: props.appId, pageNum: 1, pageSize: 1 })
    oldQuestion.value = result.data?.records[0] ?? {}
    if (oldQuestion.value) {
      questionContent.value = (oldQuestion.value.questionContent ?? []).map((item) => ({
        ...item,
        // 默认不显示题目选项
        isShow: false
      }))
    }
  } catch (e: any) {
    Message.error('获取数据失败，' + e)
  }
}
/**
 * AI 生成题目成功后执行
 */
const onAiGenerateSuccess = (result: QuestionContentDTO[]) => {
  // Message.success(`AI 生成题目成功，生成 ${result.length} 道题目`)
  //原有的基础上累加
  questionContent.value = [...questionContent.value, ...result]
}

const onAiGenerateSuccessSSE = (result: QuestionContentDTO) => {
  //原有的基础上累加
  questionContent.value = [...questionContent.value, result]
}
let close: any
const onSSEStart = (event: any) => {
  close = Modal.info({
    title: 'AI生成题目',
    content: '正在生成题目，请稍等...',
    footer: false
  }).close
}
const onSSEClose = (event: any) => {
  Message.success('生成完毕')
  close?.()
}
// 获取旧数据
watchEffect(() => {
  loadData()
})
</script>

<template>
  <div id="addQuestionPage">
    <p class="h2">设置题目</p>
    <a-form
      :model="questionContent"
      :style="{ width: '480px' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item label="应用 id">
        {{ appId }}
      </a-form-item>
      <a-form-item label="题目列表" :content-flex="false" :merge-props="false">
        <a-space>
          <!--从底部添加，所以把当前数组的最大长度作为索引值-->
          <a-button @click="addQuestionForForm(questionContent.length)"> 底部添加题目</a-button>
          <!-- AI 生成抽屉 -->
          <AiGenerateQuestionDrawer
            :appId="appId"
            :on-s-s-e-success="onAiGenerateSuccessSSE"
            :on-s-s-e-start="onSSEStart"
            :onSSEClose="onSSEClose"
            :onSuccess="onAiGenerateSuccess"
          />
        </a-space>
        <!--遍历每道题目-->
        <div v-for="(question, index) in questionContent" :key="index">
          <a-space size="large">
            <p class="h3">题目 {{ index + 1 }}</p>
            <a-button size="small" @click="addQuestionForForm(index + 1)"> 添加题目</a-button>
            <a-button size="small" status="danger" @click="deleteQuestion(index)">
              删除题目
            </a-button>
          </a-space>
          <a-form-item :label="`题目 ${index + 1} 标题`">
            <a-input v-model="question.title" placeholder="请输入标题" />
          </a-form-item>
          <!--题目选项-->
          <icon-right
            class="icon-down-and-right"
            :rotate="question.isShow ? 90 : 0"
            @click="doClickOptionsIcon(question)"
          />
          <a-space size="large">
            <p class="h4">题目{{ index + 1 }} 选项列表</p>
            <a-button
              size="small"
              @click="addQuestionOption(question, question.options?.length ?? 0)"
            >
              底部添加选项
            </a-button>
          </a-space>
          <a-form-item
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            :label="`选项 ${optionIndex + 1}`"
            :content-flex="false"
            :merge-props="false"
            v-show="question.isShow"
          >
            <a-form-item label="选项key">
              <a-input v-model="option.key" placeholder="请输入选项 key" />
            </a-form-item>
            <a-form-item label="选项值">
              <a-input v-model="option.value" placeholder="请输入选项值" />
            </a-form-item>
            <a-form-item label="选项结果" v-if="AppTypeEnum.SCORE !== appInfo.appType">
              <a-input v-model="option.result" placeholder="请输入选项结果" />
            </a-form-item>
            <a-form-item label="选项得分" v-else>
              <a-input-number v-model="option.score" placeholder="请输入选项得分" />
            </a-form-item>
            <a-space size="large">
              <a-button size="mini" @click="addQuestionOption(question, optionIndex + 1)">
                添加选项
              </a-button>
              <a-button
                size="mini"
                status="danger"
                @click="deleteQuestionOption(question, optionIndex)"
              >
                删除选项
              </a-button>
            </a-space>
          </a-form-item>
          <!--题目选项结尾-->
        </div>
      </a-form-item>
      <a-form-item>
        <a-button :loading="submitting" type="primary" html-type="submit" style="width: 120px">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="scss">
#addQuestionPage {
  .icon-down-and-right {
    margin-right: 4px;
    cursor: pointer;
  }

  .h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
    margin-bottom: 32px;
  }

  .h3 {
    display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
  }

  .h4 {
    display: block;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
  }
}
</style>
