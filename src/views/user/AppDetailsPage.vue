<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'
import { AppTypeEnumMap } from '@/api/models/enums/AppTypeEnum'
import { ScoringStrategyEnumMap } from '@/api/models/enums/ScoringStrategyEnum'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import { useUserStore } from '@/stores/userStore'
import { queryById } from '@/api/controller/user/appController'
import { Message } from '@arco-design/web-vue'
import { buildAppShareUrl, copyText } from '@/utils/share'

interface Props {
  appId: string
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return ''
  }
})

const data = ref<QueryAppDetailsRespDTO>({})
const userStore = useUserStore()
const loginUserId = userStore.loginUser.userId

const isMy = computed(() => {
  return loginUserId && loginUserId === data.value.userId
})

const loadData = async () => {
  if (props.appId === '' || props.appId.startsWith('__arco_menu')) {
    return
  }

  try {
    const result = await queryById(props.appId)
    data.value = result.data as QueryAppDetailsRespDTO
  } catch (e: any) {
    Message.error('获取数据失败: ' + e)
  }
}

const doClickShare = async () => {
  try {
    await copyText(buildAppShareUrl(props.appId))
    Message.success('分享链接已复制')
  } catch (err) {
    console.error('Unable to copy share url', err)
    Message.error('分享链接复制失败')
  }
}

watchEffect(() => {
  loadData()
})
</script>

<template>
  <div id="appDetailPage">
    <a-card>
      <a-row style="margin-bottom: 16px">
        <a-alert v-if="data.reviewStatus === 0" type="warning">
          当前应用未审核，请耐心等待。
        </a-alert>
        <a-alert v-if="data.reviewStatus === 2" type="error">
          当前应用审核不通过，原因：{{ data.reviewMessage }}
        </a-alert>
        <a-col flex="auto" class="content-wrapper">
          <a-typography-title :heading="4" style="margin-bottom: 16px">
            {{ data.appName }}
          </a-typography-title>

          <a-descriptions
            :column="1"
            size="medium"
            layout="horizontal"
            style="margin-bottom: 16px"
          >
            <a-descriptions-item label="应用描述">
              <div class="desc-limit">{{ data.appDesc }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="应用类型">
              {{ AppTypeEnumMap[data.appType as number] }}
            </a-descriptions-item>
            <a-descriptions-item label="评分策略">
              {{ ScoringStrategyEnumMap[data.scoringStrategy as number] }}
            </a-descriptions-item>
            <a-descriptions-item label="作者">
              <div style="display: flex; align-items: center">
                <a-avatar
                  :size="24"
                  :image-url="data.userInfo?.userAvatar"
                  style="margin-right: 8px"
                />
                <a-typography-text>
                  {{ data.userInfo?.userName ?? '匿名用户' }}
                </a-typography-text>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              {{ dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </a-descriptions-item>
          </a-descriptions>

          <a-space size="medium">
            <a-button v-if="data.reviewStatus === 1" type="primary" :href="`/answer/do/${appId}`">
              开始答题
            </a-button>
            <a-button v-if="data.reviewStatus === 1" @click="doClickShare">分享应用</a-button>
            <a-button v-if="isMy" :href="`/add/question/${appId}`">设置题目</a-button>
            <a-button v-if="isMy" :href="`/add/scoringResult/${appId}`">设置评分</a-button>
            <a-button v-if="isMy" :href="`/add/app/${appId}`">修改应用</a-button>
          </a-space>
        </a-col>
        <a-col flex="320px">
          <a-image width="100%" :src="data.appIcon" />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<style scoped lang="scss">
#appDetailPage {
  .content-wrapper {
    max-width: calc(100% - 320px);
    word-break: break-word;
    min-width: 0;
  }

  .content-wrapper > * {
    margin-bottom: 24px;
  }

  .h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    font-weight: bold;
    unicode-bidi: isolate;
  }
}
</style>
