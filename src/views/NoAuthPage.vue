<script setup lang="ts">
import { useRouter } from 'vue-router'

let router = useRouter()
</script>

<template>
  <a-result
    status="403"
    subtitle="没有当前页面的访问权限"
  >
    <template #extra>
      <a-space>
        <a-button type="primary" @click="router.back()">返回</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<style scoped lang="scss">

</style>
