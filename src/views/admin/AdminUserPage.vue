<script setup lang="ts">
import {  ref, watchEffect } from 'vue'
import { deleteById, queryPage } from '@/api/controller/admin/userController'
import type { QueryPageRespDTO } from '@/api/models/admin/user/QueryPageRespDTO'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import type { QueryPageReqDTO } from '@/api/models/admin/user/QueryPageReqDTO'
import { UserRoleEnumMap } from '@/api/models/enums/UserRoleEnum'
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  pageNum: 1,
  pageSize: 5
}
const formSearchParams = ref<QueryPageReqDTO>({})
const searchParams = ref<QueryPageReqDTO>({
  ...initSearchParams
})
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
const total = ref<number>()

const loadData = async () => {
  try {
    const result = await queryPage(searchParams.value)
    data.value = result.data?.records as QueryPageRespDTO[]
    total.value = result.data?.total
  } catch (e: any) {
    Message.error('获取数据失败，' + e)
  }
}
const data = ref<QueryPageRespDTO[]>([])
const doDelete = async (userId: string) => {
  try {
    await deleteById(userId)
    doSearch()
  } catch (e: any) {
    Message.error('操作失败')
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
/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData()
})
const scroll = {
  x: 1600,
  y: 1000
}
const columns = [
  {
    title: 'id',
    dataIndex: 'userId',
    // fixed: 'left',
    align: 'center'
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    align: 'center'
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    align: 'center'
  },
  {
    title: '用户头像',
    dataIndex: 'userAvatar',
    slotName: 'userAvatar',
    align: 'center'
  },
  {
    title: '用户简介',
    dataIndex: 'userProfile',
    ellipsis: true,
    tooltip: true,
    align: 'center'
  },
  {
    title: '权限',
    dataIndex: 'userRole',
    slotName: 'userRole',
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
        <a-form-item field="userId" label="id">
          <a-input allow-clear v-model="formSearchParams.userId" placeholder="请输入id" />
        </a-form-item>
        <a-form-item field="userName" label="用户名">
          <a-input allow-clear v-model="formSearchParams.userName" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item field="userAccount" label="账号">
          <a-input allow-clear v-model="formSearchParams.userAccount" placeholder="请输入账号" />
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
      total
    }"
    @page-change="onPageChange"
  >
    <template #userAvatar="{ record }">
      <a-image width="64" :src="record.userAvatar" />
    </template>
    <template #userRole="{ record }">
      {{ UserRoleEnumMap[record.userRole]}}
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
    </template>
    <template #updateTime="{ record }">
      {{ record.updateTime ? dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button :disabled="userStore.loginUser.userId === record.userId" status="danger" @click="Modal.warning({
            title:'温馨提示',
            content: '您是否确认删除该用户？',
            hideCancel: false,
            onOk: () => {
              doDelete(record.userId)
            }
          })">删除</a-button>
      </a-space>
    </template>
  </a-table>
</template>

<style scoped>

</style>
