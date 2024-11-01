<script setup lang="ts">
import { Message, type TableColumnData } from '@arco-design/web-vue'
import { ReviewStatusEnum, ReviewStatusEnumMap } from '@/api/models/enums/ReviewStatusEnum'
import { AppTypeEnumMap } from '@/api/models/enums/AppTypeEnum'
import { ScoringStrategyEnumMap } from '@/api/models/enums/ScoringStrategyEnum'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import { ref, watchEffect } from 'vue'
import type { QueryMyAppPageReqDTO } from '@/api/models/user/app/QueryPageDTO'
import type { QueryPageRespDTO } from '@/api/models/admin/app/QueryPageDTO'
import { queryMyPage } from '@/api/controller/user/appController'
import { useRouter } from 'vue-router'

const router = useRouter()
// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  pageNum: 1,
  pageSize: 10
}
const data = ref<QueryPageRespDTO[]>([])
const total = ref<number>()
const formSearchParams = ref<QueryMyAppPageReqDTO>({})
const searchParams = ref<QueryMyAppPageReqDTO>({
  ...initSearchParams
})
const onPageChange = (page: number) => {
  searchParams.value = {
    //直接结构searchParams是因为可能包含其他搜索参数（formSearchParams）
    ...searchParams.value,
    pageNum: page
  }
}
const loadData = async () => {
  try {
    const result = await queryMyPage(searchParams.value)
    data.value = result.data?.records as QueryPageRespDTO[]
    total.value = result.data?.total
  } catch (e: any) {
    Message.error('获取数据失败，' + e)
  }
}
const doSearch = () => {
  searchParams.value = {
    ...initSearchParams,
    ...formSearchParams.value
  }
}
const resetSearchParam = () => {
  formSearchParams.value = {}
  doSearch()
}
/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData()
})
const scroll = {
  x: 2000,
  y: 1000
}
// 表格列配置
const columns = [
  {
    title: 'id',
    dataIndex: 'appId',
    // fixed: 'left',
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'appName',
    ellipsis: true,
    tooltip: true,
    align: 'center'
  },
  {
    title: '描述',
    dataIndex: 'appDesc',
    ellipsis: true,
    tooltip: true,
    align: 'center'
  },
  {
    title: '图标',
    dataIndex: 'appIcon',
    slotName: 'appIcon',
    align: 'center'
  },
  {
    title: '应用类型',
    dataIndex: 'appType',
    slotName: 'appType',
    align: 'center'
  },
  {
    title: '评分策略',
    dataIndex: 'scoringStrategy',
    slotName: 'scoringStrategy',
    align: 'center'
  },
  {
    title: '审核状态',
    dataIndex: 'reviewStatus',
    slotName: 'reviewStatus',
    align: 'center'
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
    ellipsis: true,
    tooltip: true,
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    slotName: 'createTime',
    align: 'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    slotName: 'updateTime',
    align: 'center'
  },
  {
    title: '操作',
    slotName: 'optional',
    fixed: 'right',
    width: 160,
    align: 'center'
  }
] as TableColumnData[]
</script>

<template>
  <a-form
    :model="formSearchParams"
    :style="{ marginBottom: '20px' }"
    layout="inline"
    @submit="doSearch"
  >
    <a-row style="margin-bottom: 16px">
      <a-col flex="auto" style="display: flex">
        <a-form-item field="userId" label="id">
          <a-input allow-clear v-model="formSearchParams.appId" placeholder="请输入id" />
        </a-form-item>
        <a-form-item field="userName" label="应用名称">
          <a-input allow-clear v-model="formSearchParams.appName" placeholder="请输入应用名称" />
        </a-form-item>
      </a-col>
      <a-col flex="100px" style="display: flex">
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100px"> 搜索</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="dashed" @click="resetSearchParam" style="width: 100px"> 重置</a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <a-table
    :columns="columns"
    :data="data"
    :scroll="scroll"
    :pagination="{
      showTotal: true,
      pageSize: searchParams.pageSize,
      current: searchParams.pageNum,
      total
    }"
    @page-change="onPageChange"
  >
    <template #appIcon="{ record }">
      <a-image width="64" :src="record.appIcon" />
    </template>
    <template #appType="{ record }">
      {{ AppTypeEnumMap[record.appType] }}
    </template>
    <template #scoringStrategy="{ record }">
      {{ ScoringStrategyEnumMap[record.scoringStrategy] }}
    </template>
    <template #reviewStatus="{ record }">
      {{ ReviewStatusEnumMap[record.reviewStatus] }}
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
    </template>
    <template #updateTime="{ record }">
      {{ record.updateTime && dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
    </template>
    <template #optional="{ record }">
      <a-space>
        <!--<a-button @click="router.push({ path: `/add/question/${record.appId}` })"
          >题目</a-button
        >-->
        <a-button @click="router.push({ path: `/app/details/${record.appId}` })"
        >详情</a-button
        >
        <a-button status="warning" @click="router.push({ path: `/add/app/${record.appId}` })"
          >编辑</a-button
        >
      </a-space>
    </template>
  </a-table>
</template>

<style scoped lang="scss">
//
</style>