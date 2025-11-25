<script setup lang="ts">
import { routes } from '@/router/route'
import { useRouter, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
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
const isScrolled = ref(false)
</script>

<template>
  <!--<a-row id="globalHeader" align="center" :wrap="false">-->
  <header class="mg-header" :class="{ scrolled: isScrolled }">
    <nav class="mg-navbar">
      <div class="mg-nav-container">
        <!-- 左：Logo -->
        <div class="mg-nav-left">
          <router-link to="/" class="mg-brand-link">
            <img class="mg-logo" src="@/assets/logo.png" alt="Ansure AI" />
            <div class="mg-brand-text">
              <span class="mg-brand-name">Ansure</span>
              <span class="mg-brand-ai">AI</span>
            </div>
          </router-link>
        </div>
        <!-- 中：菜单 -->
        <div class="mg-nav-center">
          <a-menu mode="horizontal" :selected-keys="selectedKeys" @menu-item-click="doMenuClick">
            <a-menu-item v-if="route.path !== '/'" @click="goBack">
              <icon-arrow-left :style="{ marginRight: '4px' }" />
              返回
            </a-menu-item>
            <a-menu-item v-for="item in filterRoutes" :key="item.path">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </div>
        <!--右：用户操作区-->
        <div class="mg-nav-right">
          <div v-if="userStore.loginUser.userId">
            <a-space>
              <a-popover position="bottom">
                <a-button status="success" shape="round">剩余AI积分: {{ userStore.userAIPoint }}</a-button>
                <template #content>
                  <p>积分会在每日0点重置 5 分</p>
                </template>
              </a-popover>
              <a-dropdown trigger="hover">
                <a-avatar>
                  <img alt="avatar" :src="userStore.loginUser.userAvatar" />
                </a-avatar>
                <template #content>
                  <a-doption @click="router.push('/person/info')">个人信息</a-doption>
                  <a-doption @click="visible = true">退出登录</a-doption>
                </template>
              </a-dropdown>
            </a-space>
          </div>
          <div v-else>
            <a-dropdown trigger="hover">
              <a-avatar> 未登录 </a-avatar>
              <template #content>
                <a-doption @click="router.push('/user/login')">立即登录</a-doption>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
    </nav>
  </header>
  <a-modal :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
    <template #title>
      退出登录
    </template>
    <div>您是否要退出当前账号？</div>
  </a-modal>
</template>

<style scoped lang="scss">

.mg-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-gray-200);
  z-index: var(--z-sticky);
  transition: all var(--transition-base);

  &.scrolled {
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: var(--shadow-md);
    border-bottom-color: var(--color-gray-300);
  }
}

.mg-navbar {
  padding: var(--spacing-md) 0;
}

.mg-nav-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; // 三栏布局
  padding: 0 var(--spacing-4xl);
}
.mg-nav-left {
  flex: 200px;   // 固定宽度（Logo 区）
  display: flex;
  align-items: center;
}
.mg-nav-center {
  flex: auto;    // 菜单自适应撑满空间
  display: flex;
  align-items: center;

  :deep(.arco-menu) {
    border-bottom: none;
    width: 100%;
    display: flex;
    justify-content: center; // 菜单居中（可去掉）
  }
}

.mg-nav-right {
  flex: 200px;   // 右侧固定宽度
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
}

.mg-nav-center {
  flex: auto;    // 菜单自适应撑满空间
  display: flex;
  align-items: center;

  :deep(.arco-menu) {
    border-bottom: none;
    width: 100%;
    display: flex;
    justify-content: center; // 菜单居中（可去掉）
  }
}

.mg-nav-right {
  flex: 200px;   // 右侧固定宽度
  display: flex;
  justify-content: flex-end;
  align-items: center;
}


.mg-nav-brand {
  display: flex;
  align-items: center;
}

.mg-brand-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-1px);
  }
}

.mg-logo {
  width: 100px;
  height: 60px;
  border-radius: var(--radius-lg);
  object-fit: cover;
}

.mg-brand-text {
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 1.5rem;
}

.mg-brand-name {
  color: var(--color-gray-900);
}

.mg-brand-ai {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 0.25rem;
}
</style>
