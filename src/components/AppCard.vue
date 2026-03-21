<script setup lang="ts">
import type { QueryPageRespDTO } from '@/api/models/user/app/QueryPageDTO'
import { useRouter } from 'vue-router'
import { IconShareInternal } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { buildAppShareUrl, copyText } from '@/utils/share'

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

const doClickShare = async () => {
  if (!props.app.appId) {
    Message.error('分享链接不可用')
    return
  }

  try {
    await copyText(buildAppShareUrl(props.app.appId))
    Message.success('分享链接已复制')
  } catch (err) {
    console.error('Unable to copy share url', err)
    Message.error('分享链接复制失败')
  }
}
</script>

<template>
  <a-card class="appCard" hoverable @click="doCardClick">
    <template #actions>
      <span class="icon-hover"> <IconShareInternal @click.stop="doClickShare" /> </span>
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
    <a-card-meta :title="app.appName">
      <template #description>
        <a-popover
          v-if="app.appDesc && app.appDesc.length > 15"
          :popup-props="{ overlayStyle: { maxWidth: '200px' } }"
        >
          <template #content>
            <div style="max-width: 168px; word-break: break-word">
              {{ app.appDesc }}
            </div>
          </template>
          <span class="desc-ellipsis">
            {{ app.appDesc.substring(0, 15) + '...' }}
          </span>
        </a-popover>
        <span v-else class="desc-ellipsis">
          {{ app.appDesc }}
        </span>
      </template>
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
