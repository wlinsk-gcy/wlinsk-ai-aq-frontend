<script setup lang="ts">
import AppCard from '@/components/AppCard.vue'
import { ref, watchEffect } from 'vue'
import type { QueryPageReqDTO, QueryPageRespDTO } from '@/api/models/user/app/QueryPageDTO'
import { queryPage } from '@/api/controller/user/appController'
// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  pageNum: 1,
  pageSize: 12
}
const formSearchParams = ref<QueryPageReqDTO>({})
const searchParams = ref<QueryPageReqDTO>({
  ...initSearchParams
})
const data = ref<QueryPageRespDTO[]>([])
const total = ref<number>(0)
/**
 * 当分页变化时，改变搜索条件，触发数据加载
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    //直接结构searchParams是因为可能包含其他搜索参数（formSearchParams）
    ...searchParams.value,
    pageNum: page
  }
}
/**
 * 执行搜索，响应式对象的值一发生变化，watchEffect就可以监听到
 */
const doSearch = () => {
  searchParams.value = {
    ...initSearchParams,
    ...formSearchParams.value
  }
}
const loadData = async () => {
  const result = await queryPage(searchParams.value)
  data.value = result.data?.records as QueryPageRespDTO[]
  total.value = result.data?.total ?? 0
}
/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData()
})
</script>

<template>
  <div id="homePage">
    <div class="searchBar">
      <a-input-search
        :style="{ width: '320px' }"
        placeholder="快速发现答题应用"
        button-text="搜索"
        size="large"
        search-button
        v-model="formSearchParams.context"
        @search="doSearch"
        allow-clear
      />
    </div>
    <!--gutter表示间距，sm表示最小屏，展示一个，md表示中屏展示两个，lg大屏展示3个，超大屏展示4个-->
    <a-list
      class="list-demo-action-layout"
      :grid-props="{ gutter: [20, 20], sm: 24, md: 12, lg: 8, xl: 6 }"
      :bordered="false"
      :data="data"
      :pagination-props="{
        pageSize: searchParams.pageSize,
        current: searchParams.pageNum,
        total
      }"
      @page-change="onPageChange"
    >
      <template #item="{ item }">
        <AppCard :app="item" />
      </template>
    </a-list>
  </div>
</template>

<style scoped lang="scss">
#homePage {
  .searchBar {
    text-align: center;
    margin-bottom: 28px;
  }

  .list-demo-action-layout {
  }
}
</style>
