<script setup lang="ts">
import { routes } from '@/router/route'
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import checkAccess from '@/access/checkAccess'
import { useUserStore } from '@/stores/userStore'
import { IconArrowLeft } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { logout } from '@/api/controller/user/userController'

const userStore = useUserStore()

let router = useRouter()
let route = useRoute()
const doMenuClick = (key: string) => {
  router.push({
    path: key
  })
}
//computed函数中任何成员发生变化，都会调用该函数，实现动态渲染
//过滤不需要展示的路由
const filterRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false
    }
    //如果权限不足也过滤掉
    return checkAccess(userStore.loginUser, item.meta?.access)
  })
})
const selectedKeys = ref(['/'])
//路由跳转时，自动更新选中的菜单项
router.afterEach((to, from, failure) => {
  //路由后置守卫切换
  selectedKeys.value = [to.path]
})
const goBack = () => {
  if (route.path === '/'){
    return
  }
  router.back()
}
const visible = ref(false);
const handleOk = async () => {
  try {
    await logout()
    await router.push('/')
    // router.go(0)
  } catch (e: any) {
    Message.error('退出失败：' + e)
  }finally {
    visible.value = false;
  }
};
const handleCancel = () => {
  visible.value = false;
}
</script>

<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu mode="horizontal" :selected-keys="selectedKeys" @menu-item-click="doMenuClick">
        <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
          <div class="titleBar" style="cursor: pointer" @click="router.push('/')">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <div class="title">AI Answering</div>
          </div>
        </a-menu-item>
        <a-menu-item v-if="route.path !== '/'" @click="goBack">
          <a-button :style="{ background: 'none' }">
            <icon-arrow-left :style="{ marginRight: '4px' }" />
            返回
          </a-button>
        </a-menu-item>
        <a-menu-item v-for="item in filterRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div v-if="userStore.loginUser.userId">
        <a-dropdown trigger="hover" :style="{ background: 'none' }">
          <a-avatar>
            <img
              alt="avatar"
              :src=userStore.loginUser.userAvatar
            />
          </a-avatar>
          <template #content>
            <a-doption >个人信息</a-doption>
            <a-doption @click="visible = true">退出登录</a-doption>
          </template>
        </a-dropdown>
      </div>
      <div v-else>
        <a-dropdown trigger="hover" :style="{ background: 'none' }">
          <a-avatar>
            未登录
          </a-avatar>
          <template #content>
            <a-doption @click="router.push('/user/login')">立即登录</a-doption>
          </template>
        </a-dropdown>
      </div>
    </a-col>
  </a-row>
  <a-modal :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
    <template #title>
      退出登录
    </template>
    <div>您是否要退出当前账号？</div>
  </a-modal>
</template>

<style scoped lang="scss">
#globalHeader {
  .titleBar {
    display: flex;
    align-items: center;

    .logo {
      width: 70px;
      height: 42px;
      margin-right: 10px;
    }

    .title {
      color: black;
    }
  }

  .arco-btn-size-medium {
    padding: 0 2px;
  }
}
</style>
