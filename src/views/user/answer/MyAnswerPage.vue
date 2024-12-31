<script setup lang="ts">
import type {
  QueryUserAnswerPageReqDTO,
  QueryUserAnswerRecordDetailsRespDTO
} from '@/api/models/user/userAnswer/UserAnswerDTO'
import { ref, watchEffect } from 'vue'
import { deleteById, queryPage } from '@/api/controller/user/userAnswerController'
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import { AppTypeEnumMap } from '@/api/models/enums/AppTypeEnum'
import { ScoringStrategyEnumMap } from '@/api/models/enums/ScoringStrategyEnum'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import { logout } from '@/api/controller/user/userController'

const formSearchParams = ref<QueryUserAnswerPageReqDTO>({})
// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  pageNum: 1,
  pageSize: 10
}
const searchParams = ref<QueryUserAnswerPageReqDTO>({
  ...initSearchParams
})
const dataList = ref<QueryUserAnswerRecordDetailsRespDTO[]>([])
const total = ref<number>(0)
/**
 * 执行搜索
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
const doDelete = async (recordId: string) => {
  try {
    await deleteById(recordId)
    doSearch()
    Message.success('删除成功')
  } catch (e) {
    Message.error('操作失败')
  }
}
const loadData = async () => {
  try {
    const result = await queryPage(searchParams.value)
    dataList.value = result.data?.records ?? []
    total.value = result.data?.total ?? 0
  } catch (e: any) {
    Message.error('获取数据失败，' + e)
  }
}
/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData()
})
const scroll = {
  x: 2100,
  y: 1000
}
// 表格列配置
const columns = [
  {
    title: 'id',
    dataIndex: 'recordId',
    align: 'center'
  },
  {
    title: '选项',
    dataIndex: 'choices',
    slotName: 'choices',
    ellipsis: true,
    tooltip: true,
    align: 'center'
  },
  {
    title: '结果 id',
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
    title: '得分',
    dataIndex: 'resultScore',
    align: 'center'
  },
  {
    title: '应用 id',
    dataIndex: 'appId',
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
    title: '创建时间',
    dataIndex: 'createTime',
    slotName: 'createTime',
    align: 'center'
  },
  {
    title: '操作',
    slotName: 'optional',
    fixed: 'right',
    width: 150,
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
        <a-form-item field="resultDesc" label="id">
          <a-input v-model="formSearchParams.recordId" placeholder="请输入id" allow-clear />
        </a-form-item>
        <a-form-item field="resultName" label="结果名称">
          <a-input v-model="formSearchParams.resultName" placeholder="请输入结果名称" allow-clear />
        </a-form-item>
        <a-form-item field="appId" label="应用 id">
          <a-input v-model="formSearchParams.appId" placeholder="请输入应用 id" allow-clear />
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
    <template #choices="{ record }">
      {{
        record.choices
          .map((item: string, index: number) => {
            return `${index + 1}.${item}`
          })
          .join('; ')
      }}
    </template>
    <template #resultPicture="{ record }">
      <a-image width="64" :src="record.resultPicture" />
    </template>
    <template #appType="{ record }">
      {{ AppTypeEnumMap[record.appType] }}
    </template>
    <template #scoringStrategy="{ record }">
      {{ ScoringStrategyEnumMap[record.scoringStrategy] }}
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
    </template>
    <template #updateTime="{ record }">
      {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button status="danger" @click="Modal.warning({
            title:'温馨提示',
            content: '您是否确认删除当前记录？',
            hideCancel: false,
            onOk: () => {
              doDelete(record.recordId)
            }
          })">删除</a-button>
      </a-space>
    </template>
  </a-table>
</template>

<style scoped lang="scss"></style>
