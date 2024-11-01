<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <!--登录注册不展示导航栏-->
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style scoped></style>
