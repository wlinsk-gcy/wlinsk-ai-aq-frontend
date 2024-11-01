<script setup lang="ts">
import type { QueryPageRespDTO } from '@/api/models/user/app/QueryPageDTO'
import { useRouter } from 'vue-router'
import { IconShareInternal } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { h } from 'vue';
import { IconExclamationCircleFill } from '@arco-design/web-vue/es/icon';
// const renderIcon = () => h(IconExclamationCircleFill);
interface Props {
  app: QueryPageRespDTO
}

const props = withDefaults(defineProps<Props>(), {
  app: () => {
    return {}
  }
})
const router = useRouter()
const doCardClick = () => {
  if (
    props.app.appId === undefined ||
    props.app.appId === '' ||
    props.app.appId.startsWith('__arco_menu')
  ) {
    return
  }
  router.push(`/app/details/${props.app.appId}`)
}
const doClickShare = () => {
  //把链接复制到粘贴板
  navigator.clipboard.writeText(import.meta.env.VITE_SHARE_APP_PATH + props.app.appId)
  Message.success('分享链接已成功复制！')
}
</script>

<template>
  <a-card class="appCard" hoverable @click="doCardClick">
    <template #actions>
      <!--      <span class="icon-hover"> <IconThumbUp /> </span>-->
      <!--@click.stop是在点击子组件是，禁止触发父组件的事件-->
      <span class="icon-hover"> <IconShareInternal @click.stop="doClickShare"/> </span>
    </template>
    <template #cover>
      <div
        :style="{
          height: '204px',
          overflow: 'hidden'
        }"
      >
        <img
          :style="{ width: '100%', transform: 'translateY(-20px)' }"
          :alt="app.appName"
          :src="app.appIcon"
        />
      </div>
    </template>
    <a-card-meta :title="app.appName" :description="app.appDesc">
      <template #avatar>
        <div :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
          <a-avatar
            :size="24"
            :image-url="app.userInfo?.userAvatar"
            :style="{ marginRight: '8px' }"
          />
          <a-typography-text>{{ app.userInfo?.userName ?? '匿名用户' }}</a-typography-text>
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<style scoped lang="scss">
.appCard {
  cursor: pointer;

  .icon-hover {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transition: all 0.1s;
  }
}

.icon-hover:hover {
  background-color: rgb(var(--gray-2));
}
</style>
