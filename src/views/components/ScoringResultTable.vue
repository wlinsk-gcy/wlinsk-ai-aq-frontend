<script setup lang="ts">
import type {
  QueryScoringResultPageReqDTO,
  QueryScoringResultPageRespDTO,
  UpdateScoringResultReqDTO
} from '@/api/models/user/scoringResult/ScoringResultDTO'
import { ref, watchEffect } from 'vue'
import { deleteById, queryPage } from '@/api/controller/user/scoringResultController'
import { Message, type TableColumnData } from '@arco-design/web-vue'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'

interface Props {
  appId: string
  doUpdate: (scoringResult: UpdateScoringResultReqDTO) => void
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return ''
  }
})
const formSearchParams = ref<QueryScoringResultPageReqDTO>({})
// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  pageNum: 1,
  pageSize: 10
}
const searchParams = ref<QueryScoringResultPageReqDTO>({
  ...initSearchParams
})
/**
 * 执行搜索
 */
const doSearch = () => {
  searchParams.value = {
    ...initSearchParams,
    ...formSearchParams.value
  }
}
/**
 * 当分页变化时，改变搜索条件，触发数据加载
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    pageNum: page
  }
}
const resetSearchParam = () => {
  formSearchParams.value = {}
  doSearch()
}
const dataList = ref<QueryScoringResultPageRespDTO[]>([])
const total = ref<number>()
const loadData = async () => {
  if (props.appId === '') {
    return
  }
  const params = {
    appId: props.appId,
    ...searchParams.value
  }
  try {
    const result = await queryPage(params)
    dataList.value = result.data?.records as QueryScoringResultPageRespDTO[]
    total.value = result.data?.total
  } catch (e: any) {
    Message.error('获取数据失败，' + e)
  }
}
const doDelete = async (resultId: string) => {
  try {
    await deleteById(resultId)
    doSearch()
  } catch (e) {
    Message.error('操作失败')
  }
}
// 暴露函数给父组件--父组件可以调用子组件的loadData函数
defineExpose({
  loadData
})
/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData()
})
const scroll = {
  x: 1600,
  y: 1000,
}
const columns = [
  {
    title: 'id',
    dataIndex: 'resultId',
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'resultName',
    align: 'center'
  },
  {
    title: '描述',
    dataIndex: 'resultDesc',
    ellipsis: true,
    tooltip: true,
    align: 'center'
  },
  {
    title: '图片',
    dataIndex: 'resultPicture',
    slotName: 'resultPicture',
    align: 'center'
  },
  {
    title: '结果属性',
    dataIndex: 'resultProp',
    align: 'center'
  },
  {
    title: '评分范围',
    dataIndex: 'resultScoreRange',
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
  <div id="scoringResultTable">
    <a-form
      :model="formSearchParams"
      :style="{ marginBottom: '16px' }"
      layout="inline"
      @submit="doSearch"
    >
      <a-row>
        <a-col flex="auto" style="display: flex">
          <a-form-item field="resultName" label="结果名称">
            <a-input
              v-model="formSearchParams.resultName"
              placeholder="请输入结果名称"
              allow-clear
            />
          </a-form-item>
          <a-form-item field="resultDesc" label="结果描述">
            <a-input
              v-model="formSearchParams.resultDesc"
              placeholder="请输入结果描述"
              allow-clear
            />
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
    <a-space direction="vertical" fill>
      <div class="addBtn">
        <a-button type="primary" @click="doUpdate?.({appId: props.appId})"> 新增</a-button>
      </div>
      <a-table
        :columns="columns"
        :scroll="scroll"
        :data="dataList"
        :pagination="{
          showTotal: true,
          pageSize: searchParams.pageSize,
          current: searchParams.pageNum,
          total
        }"
        @page-change="onPageChange"
      >
        <template #resultPicture="{ record }">
          <a-image width="64" :src="record.resultPicture" />
        </template>
        <template #createTime="{ record }">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #updateTime="{ record }">
          {{ record.updateTime ? dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
        </template>
        <template #optional="{ record }">
          <a-space>
            <a-button
              status="success"
              @click="
                doUpdate?.({
                  appId: props.appId,
                  resultId: record.resultId,
                  resultName: record.resultName,
                  resultDesc: record.resultDesc,
                  resultPicture: record.resultPicture,
                  resultProp: record.resultProp,
                  resultScoreRange: record.resultScoreRange
                })
              "
              >修改
            </a-button>
            <a-button status="danger" @click="doDelete(record.resultId)">删除</a-button>
          </a-space>
        </template>
      </a-table>
    </a-space>
  </div>
</template>

<style scoped lang="scss">
#scoringResultTable {
  .addBtn {
    text-align: right;
  }
}
</style>
