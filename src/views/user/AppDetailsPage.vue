<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'
import { AppTypeEnumMap } from '@/api/models/enums/AppTypeEnum'
import { ScoringStrategyEnumMap } from '@/api/models/enums/ScoringStrategyEnum'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import { useUserStore } from '@/stores/userStore'
import { queryById } from '@/api/controller/user/appController'
import { Message } from '@arco-design/web-vue'

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
let loginUserId = userStore.loginUser.userId
// 是否为本人创建
const isMy = computed(() => {
  //data发生变化时需要重新计算一下
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
    Message.error('获取数据失败，' + e)
  }
}

const doClickShare = () => {
  //把链接复制到粘贴板
  navigator.clipboard.writeText(import.meta.env.VITE_SHARE_APP_PATH + props.appId)
  Message.success('分享链接已成功复制！')
}
/**
 * 监听成员变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData()
})

</script>
<template>
  <div id="appDetailPage">
    <a-card>
      <a-row style="margin-bottom: 16px">
        <a-alert type="warning" v-if="data.reviewStatus === 0">当前应用未审核，请耐心等候。</a-alert>
        <a-alert type="error" v-if="data.reviewStatus === 2">当前应用审核不通过，原因：{{data.reviewMessage}}</a-alert>
        <a-col flex="auto" class="content-wrapper">
          <p class="h2">{{ data.appName }}</p>
          <p>应用描述：{{ data.appDesc }}</p>
          <p>应用类型：{{ AppTypeEnumMap[data.appType as number] }}</p>
          <p>评分策略：{{ ScoringStrategyEnumMap[data.scoringStrategy as number] }}</p>
          <p>
            <a-space>
              作者：
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <a-avatar
                  :size="24"
                  :image-url="data.userInfo?.userAvatar"
                  :style="{ marginRight: '8px', background: 'none' }"
                />
                <a-typography-text>{{ data.userInfo?.userName ?? '匿名用户' }}</a-typography-text>
              </div>
            </a-space>
          </p>
          <p>创建时间：{{ dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
          <a-space size="medium">
            <a-button v-if="data.reviewStatus === 1" type="primary" :href="`/answer/do/${appId}`">开始答题</a-button>
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
  // > 代表只对content-wrapper下一层的标签生效，仅一层
  .content-wrapper > * {
    margin-bottom: 24px;
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
  }
}
</style>
