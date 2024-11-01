<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watchEffect } from 'vue'
import type { QueryUserAnswerRecordDetailsRespDTO } from '@/api/models/user/userAnswer/UserAnswerDTO'
import { queryById } from '@/api/controller/user/userAnswerController'
import { Message } from '@arco-design/web-vue'
import { AppTypeEnumMap } from '@/api/models/enums/AppTypeEnum'
import { ScoringStrategyEnumMap } from '@/api/models/enums/ScoringStrategyEnum'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'

interface Props {
  recordId: string
}

const props = withDefaults(defineProps<Props>(), {
  recordId: () => {
    return ''
  }
})
const router = useRouter()
const data = ref<QueryUserAnswerRecordDetailsRespDTO>({})
const loadData = async () => {
  if (props.recordId === '') {
    return
  }
  try {
    const result = await queryById(props.recordId)
    data.value = result.data as QueryUserAnswerRecordDetailsRespDTO
  } catch (e: any) {
    Message.error('获取数据失败，' + e)
  }
}

watchEffect(() => {
  loadData()
})
</script>

<template>
  <div id="answerResultPage">
    <a-card>
      <a-row style="margin-bottom: 16px" :align="'center'">
        <a-col flex="auto" class="content-wrapper">
          <p class="h2">{{ data.resultName }}</p>
          <p>结果描述：{{ data.resultDesc }}</p>
          <p>结果 id：{{ data.resultId }}</p>
          <p>结果得分：{{ data.resultScore }}</p>
          <p>
            我的答案：{{
              data.choices
                ?.map((item, index) => {
                  return `${index + 1}.${item}`
                })
                .join('; ')
            }}
          </p>
          <p>应用 id：{{ data.appId }}</p>
          <p>应用类型：{{ AppTypeEnumMap[data.appType ?? -1] }}</p>
          <p>评分策略：{{ ScoringStrategyEnumMap[data.scoringStrategy ?? -1] }}</p>
          <p>
            <a-space>
              答题人：
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <a-avatar
                  :size="24"
                  :image-url="data.userInfo?.userAvatar"
                  :style="{ marginRight: '8px', background: 'none' }"
                />
                <a-typography-text>{{ data.userInfo?.userName ?? '匿名用户' }} </a-typography-text>
              </div>
            </a-space>
          </p>
          <p>答题时间：{{ dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </a-col>
        <a-col flex="320px">
          <a-image width="100%" :src="data.resultPicture" />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<style scoped lang="scss">
#answerResultPage {
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

  .content-wrapper > * {
    margin-bottom: 24px;
  }
}
</style>
