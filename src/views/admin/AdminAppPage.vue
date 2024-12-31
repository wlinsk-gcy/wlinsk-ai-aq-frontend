<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { QueryPageReqDTO, QueryPageRespDTO } from '@/api/models/admin/app/QueryPageDTO'
import { deleteById, queryPage, reviewApp } from '@/api/controller/admin/appController'
import { AppTypeEnumMap } from '@/api/models/enums/AppTypeEnum'
import { ScoringStrategyEnumMap } from '@/api/models/enums/ScoringStrategyEnum'
import { ReviewStatusEnum, ReviewStatusEnumMap } from '@/api/models/enums/ReviewStatusEnum'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  pageNum: 1,
  pageSize: 10
}
const formSearchParams = ref<QueryPageReqDTO>({})
const searchParams = ref<QueryPageReqDTO>({
  ...initSearchParams
})
const data = ref<QueryPageRespDTO[]>([]);
const total = ref<number>()
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
const loadData = async () => {
  try {
    const result = await queryPage(searchParams.value)
    data.value = result.data?.records as QueryPageRespDTO[]
    total.value = result.data?.total
  } catch (e: any) {
    Message.error('获取数据失败，' + e)
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
const resetSearchParam = () => {
  formSearchParams.value = {}
  doSearch()
}
const doReview = async (
  record: QueryPageRespDTO,
  reviewStatus: number,
  reviewMessage?: string
) => {
  // console.log(record,reviewStatus,reviewMessage)
  try {
    await reviewApp({ appId: record.appId, reviewStatus, reviewMessage })
    doSearch()
    Message.success('审核成功')
  } catch (e: any) {
    Message.error(e)
  }
}
const doDelete = async (appId: string) => {
  try {
    await deleteById(appId)
    doSearch()
    Message.success('删除成功')
  } catch (e) {
    Message.error('删除失败：' + e)
  }
}
/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData()
})
const scroll = {
  x: 2500,
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
    title: '审核时间',
    dataIndex: 'reviewTime',
    slotName: 'reviewTime',
    align: 'center'
  },
  {
    title: '审核人 id',
    dataIndex: 'reviewerId',
    align: 'center'
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
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
    width: 224,
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
          <a-button type="primary" html-type="submit" style="width: 100px"> 搜索 </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="dashed" @click="resetSearchParam" style="width: 100px"> 重置 </a-button>
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
      total,
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
    <template #reviewTime="{ record }">
      {{
        record.reviewTime && dayjs(record.reviewTime).format("YYYY-MM-DD HH:mm:ss")
      }}
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #updateTime="{ record }">
      {{ record.updateTime && dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button
          v-if="record.reviewStatus !== ReviewStatusEnum.REVIEW_PASS"
          status="success"
          @click="doReview(record, ReviewStatusEnum.REVIEW_PASS, '')"
        >
          通过
        </a-button>
        <a-button
          v-if="record.reviewStatus !== ReviewStatusEnum.REVIEW_FAIL"
          status="warning"
          @click="doReview(record, ReviewStatusEnum.REVIEW_FAIL, '不符合上架要求')"
        >
          拒绝
        </a-button>
        <a-button status="danger" @click="Modal.warning({
            title:'温馨提示',
            content: '您是否确认删除该应用？',
            hideCancel: false,
            onOk: () => {
              doDelete(record.appId)
            }
          })">删除</a-button>
      </a-space>
    </template>
  </a-table>
</template>

<style scoped></style>