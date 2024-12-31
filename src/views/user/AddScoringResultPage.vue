<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type {
  AddScoringResultReqDTO,
  UpdateScoringResultReqDTO
} from '@/api/models/user/scoringResult/ScoringResultDTO'
import PictureUploader from '@/components/PictureUpload.vue'
import ScoringResultTable from '@/views/components/ScoringResultTable.vue'
import { add, update } from '@/api/controller/user/scoringResultController'
import { Message } from '@arco-design/web-vue'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'
import { queryById } from '@/api/controller/user/appController'
import { AppTypeEnum } from '@/api/models/enums/AppTypeEnum'

interface Props {
  appId?: string
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return ''
  }
})
const appInfo = ref<QueryAppDetailsRespDTO>({})
const updateId = ref('')
//用来存放子组件利用defineExpose暴露出来的函数
const tableRef = ref()
const form = ref<AddScoringResultReqDTO>({
  appId: props.appId
})
const okLoading = ref(false)
const formRef: any = ref(null);
const handleSubmitV2 = async () => {
  const error = await formRef.value?.validate();
  if (!error) {
    //提交表单逻辑
    okLoading.value = true
    await handleSubmit()
    okLoading.value = false
    //return true就会关闭对话框
    return true;
  }
  return false;
}
const handleSubmit = async () => {
  if (props.appId === '') {
    return
  }
  try {
    if (updateId.value !== '') {
      //修改
      await update({ resultId: updateId.value, ...form.value })
    } else {
      //新增
      await add(form.value)
    }
    Message.success('操作成功')
    form.value = {
      appId: props.appId
    }
    if (tableRef.value) {
      //操作成功后，让子组件刷新表单
      await tableRef.value.loadData()
      updateId.value = ''
    }
  } catch (e: any) {
    Message.error('操作失败，' + e)
  }
}
const doUpdate = (scoringResult: UpdateScoringResultReqDTO) => {
  updateId.value = scoringResult.resultId ?? ''
  form.value = scoringResult
  visible.value = true
}
const visible = ref(false)
const handleCancel = () => {
  visible.value = false
  formRef.value?.clearValidate();
  form.value = {
    appId: props.appId
  }
}
const loadAppInfo = async () => {
  if (props.appId === '' || props.appId.startsWith('__arco_menu')){
    return
  }
  const appResult = await queryById(props.appId)
  appInfo.value = appResult.data as QueryAppDetailsRespDTO
}
// 获取旧数据
watchEffect(() => {
  loadAppInfo()
})
const nonZeroInteger = /^[1-9][0-9]*$/
</script>

<template>
  <div id="addScoringResultPage">
    <p class="h2" style="margin-bottom: 32px">评分管理</p>
    <ScoringResultTable :appId="appId" :doUpdate="doUpdate" ref="tableRef" />
    <a-modal
      v-model:visible="visible"
      title="设置评分"
      @cancel="handleCancel"
      :on-before-ok="handleSubmitV2"
      :loading="okLoading"
    >
      <a-form
        :model="form"
        :style="{ width: '480px' }"
        label-align="left"
        auto-label-width
        @submit="handleSubmit"
        ref="formRef"
      >
        <a-form-item label="应用 id">
          {{ appId }}
        </a-form-item>
        <a-form-item v-if="updateId" field="resultId" label="修改评分 id">
          {{ updateId }}
        </a-form-item>
        <a-form-item
          field="resultName"
          label="结果名称"
          :rules="[{ required: true, message: '请输入应用名称' }]"
          validate-trigger="blur"
        >
          <a-input v-model="form.resultName" placeholder="请输入结果名称" />
        </a-form-item>
        <a-form-item
          field="resultDesc"
          label="结果描述"
          :rules="[{ required: true, message: '请输入结果描述' }]"
          validate-trigger="blur"
        >
          <a-input v-model="form.resultDesc" placeholder="请输入结果描述" />
        </a-form-item>
        <a-form-item
          field="resultPicture"
          label="结果图标"
          :rules="[{ required: true, message: '请输入结果图标' }]"
          validate-trigger="blur"
        >
          <PictureUploader
            :value="form.resultPicture"
            :onChange="(value) => (form.resultPicture = value)"
          />
        </a-form-item>
        <a-form-item field="resultProp" label="结果集" v-if="AppTypeEnum.SCORE !== appInfo.appType">
          <a-input-tag
            v-model="form.resultProp"
            :style="{ width: '320px' }"
            placeholder="请输出结果集，按回车确认"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          field="resultScoreRange"
          label="结果得分范围"
          :rules="[
            { required: true, message: '请输入结果得分范围' },
            {
              validator: (value: any, cb: any) => {
                if (!nonZeroInteger.test(value)) {
                  cb('请输入非零正整数')
                }
              }
            }
          ]"
          validate-trigger="blur"
        >
          <a-input-number
            v-model="form.resultScoreRange"
            placeholder="请输入结果得分范围，用户成绩大于等于该数值则匹配"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
#addScoringResultPage {
  .h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
  }
}
</style>
